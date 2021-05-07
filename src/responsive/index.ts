import { PropertiesHyphen } from "csstype";
import { createBreakpoints } from "../breakpoints";
import { BaseBreakpoints } from "../breakpoints/utils";
import { Styles } from "../interfaces";

type ResponsiveValue = string;

export default function createResponsive<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const { sortValuesByBp, up } = createBreakpoints(breakpoints);
  type ResponsiveValues = Partial<Record<B, ResponsiveValue>>;
  return function responsive(
    prop: keyof PropertiesHyphen,
    values: ResponsiveValues
  ) {
    const sortedFluidValuesArray = sortValuesByBp(
      Object.entries(values) as [B, ResponsiveValue][]
    );

    return sortedFluidValuesArray.reduce((acc, [bp, size]) => {
      acc[up(bp)] = {
        [prop]: size,
      };

      return acc;
    }, {} as Styles);
  };
}
