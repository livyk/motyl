# motyl [![NPM Publish](https://github.com/livyk/motyl/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/livyk/motyl/actions/workflows/npm-publish.yml) [![GitHub Logo](https://img.shields.io/npm/v/motyl)](https://www.npmjs.com/package/motyl)

## Install

A set of helper functions that make it easy to create responsive css-in-js styles. Allows you to create responsive styles and fluid styles with zero runtime JavaScript calculations.

The package is designed to be used with the mobile first strategy

```console
$ npm install motyl
```

or

```console
$ yarn add motyl
```

## Includes

### Breakpoin functions

```javascript
import { createStyleTools } from "motyl";
import { styled } from "@linaria/react";

const breakpoints = {
  xs: "320px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
};

const {
  breakpoints: { up, down, between, only },
} = createStyleTools(breakpoints);

const Title = styled.h1`
  font-family: 30px;
  ${up("lg")} /*@media(min-width: 1200px)*/ {
    font-family: 400px;
  }
  ${down("md")} /*@media(max-width: 899.98px)*/ {
    width: 70%;
  }

  ${between("sm", "lg")} /*@media(min-width: 600px) and (max-width: 1199.98px)*/ {
    color: #ffffff;
  }
`;
```

### Fluid Styles

The flowing styling assistant is inspired by the [polished](https://polished.js.org/) and [styled-system](https://styled-system.com/). It allows you to write styles that smoothly change between breakpoints. These values are calculated using `calc` and `vw`. You can read how it works [here](https://css-tricks.com/snippets/css/fluid-typography/).

> Note that fluid values are not calculated using the device screen size, but the viewport size. This means that on a 1280px screen with a 1200px browser window, the viewport can be 1160px. This may be due to the fact that part of the space is taken up by the scrollbar in Windows.

```javascript
import { createStyleTools } from "motyl";
import { styled } from "@linaria/react";

const breakpoints = {
  xs: "320px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
};

const { fluidStyle } = createStyleTools(breakpoints);

const Title = styled.h1`
  ${fluidStyle({
    fontSize: {
      sm: "30px",
      md: "40px",
    },
    marginTop: {
      sm: "0px",
      md: "10px",
      lg: "20px",
    },
  })}
`;
```

In the example above, the font-size will be 30px on viewports up to 600px. After this breakpoint, the value will grow linearly to 40px. If the viewport size is 900px or more, the size will be 40px.

### Use Breakpoint Hook

Hook for breakpoints in React components. Almost identical in function with a similar hook in styled-breakpoints. Built on top of react-responsive.

```javascript
import { createStyleTools, useBreakpoint } from "motyl";
import { styled } from "@linaria/react";

const breakpoints = {
  xs: "320px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
};

const {
  breakpoints: { down },
} = createStyleTools(breakpoints);

const Home = () => {
  const downSm = useBreakpoint(down("sm"));
  return <Layout>{downSm ? "down-sm" : "up-sm"}</Layout>;
};
```

## Why

I really like the styled-components syntax and don't really like its runtime, so I had to change it to [Linaria](https://github.com/callstack/linaria). It is almost impossible to use styled-breakpoints with Linaria, because it gets breakpoints from the context. I have not been able to find alternatives for styled-breakpoints, and transferring functions from project to project is useless work. So a set of the most needed useful functions became this package.
