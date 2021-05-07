import { createBreakpoints } from "./breakpoints";
import { BaseBreakpoints } from "./breakpoints/utils";
import { createFluidStyle } from "./fluid";
import createResponsive from "./responsive";
export { default as matchMedia } from "./helpers/matchMedia";
export { default as useBreakpoint } from "./helpers/useBreakpoint";
export { createStyleTools };

function createStyleTools<B extends string>(breakpoints: BaseBreakpoints<B>) {
  const breakpointTools = createBreakpoints(breakpoints);
  const responsive = createResponsive(breakpoints);
  const fluidStyle = createFluidStyle(breakpoints);

  return { responsive, breakpoints: breakpointTools, fluidStyle };
}
