import { createStyleTools } from "../src/index";
import { Styles } from "../src/interfaces";
const breakpoints = {
  xs: "320px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
};

const {
  fluidStyle,
  breakpoints: { up, between },
} = createStyleTools(breakpoints);

describe("Fluid Style", () => {
  it("should set css props on first position in style map", () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
    });
    expect(
      Object.keys(styles)
        .slice(0, 2)
        .some((prop) => prop.startsWith("@"))
    ).toBeFalsy();
  });

  it("should set value for smallest breakpoint in rule without media", () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
    });
    expect(styles.marginTop).toBe("100px");
    expect(styles.padding).toBe("300px");
  });

  it("should set value for largest breakpoint in rule with up media", () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
    });
    expect((styles[up("lg")] as Styles).marginTop).toBe("200px");
    expect((styles[up("md")] as Styles).padding).toBe("400px");
  });

  it("should stack rules for equal media in one object", () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
      width: {
        md: "40px",
        lg: "70px",
      },
    });

    expect(styles[between("md", "lg")] as Styles).toHaveProperty("marginTop");
    expect(styles[between("md", "lg")] as Styles).toHaveProperty("width");
    expect(styles[between("md", "lg")] as Styles).not.toHaveProperty("padding");
  });

  it('should sort rules by lowest breakpoint in "between" media', () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
      width: {
        sm: "40px",
        lg: "70px",
      },
    });
    const stylesKeys = Object.keys(styles);
    const xsMdKeyIndex = stylesKeys.indexOf(between("xs", "md"));
    const smLgKeyIndex = stylesKeys.indexOf(between("sm", "lg"));
    const mdLgKeyIndex = stylesKeys.indexOf(between("md", "lg"));

    const marginTopIndex = stylesKeys.indexOf("marginTop");
    const paddingIndex = stylesKeys.indexOf("padding");
    const widthIndex = stylesKeys.indexOf("width");

    expect(xsMdKeyIndex).toBeLessThan(smLgKeyIndex);
    expect(xsMdKeyIndex).toBeLessThan(mdLgKeyIndex);
    expect(xsMdKeyIndex).toBeGreaterThan(marginTopIndex);
    expect(xsMdKeyIndex).toBeGreaterThan(paddingIndex);
    expect(xsMdKeyIndex).toBeGreaterThan(widthIndex);

    expect(smLgKeyIndex).toBeLessThan(mdLgKeyIndex);
  });

  it('should sort "up" rules by breakpoint index in media', () => {
    const styles = fluidStyle({
      marginTop: {
        md: "100px",
        lg: "200px",
      },
      padding: {
        xs: "300px",
        md: "400px",
      },
      width: {
        sm: "40px",
        lg: "70px",
      },
    });
    const stylesKeys = Object.keys(styles);

    const mdLgKeyIndex = stylesKeys.indexOf(between("md", "lg"));

    const upMdKeyIndex = stylesKeys.indexOf(up("md"));
    const upLgKeyIndex = stylesKeys.indexOf(up("lg"));

    expect(upLgKeyIndex).toBeGreaterThan(upMdKeyIndex);
    expect(upMdKeyIndex).toBeGreaterThan(mdLgKeyIndex);
  });
});
