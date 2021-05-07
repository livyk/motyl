import stripUnit from "../helpers/stripUnit";

export type BaseBreakpoints<B extends string> = Record<B, string>;
type BreakpointTuple<B extends string> = [B, string];
type BreakpointsIndexesMap<B extends string> = Record<B, number>;
type BreakpointsArray<B extends string> = Array<BreakpointTuple<B>>;

export function getBreakpointsArray<B extends string>(
  breakpoints: BaseBreakpoints<B>
): BreakpointsArray<B> {
  const unsortedBreakpoints = Object.entries(
    breakpoints
  ) as BreakpointsArray<B>;
  return unsortedBreakpoints.sort((a, b) => {
    const aVal = stripUnit(a[1]) as number;
    const bVal: number = stripUnit(b[1]) as number;
    return aVal - bVal;
  }) as [B, string][];
}

export function getBreakpointsIndexesMap<B extends string>(
  bpArray: BreakpointsArray<B>
): BreakpointsIndexesMap<B> {
  return bpArray.reduce((acc, curr, index) => {
    acc[curr[0]] = index;
    return acc;
  }, {} as BreakpointsIndexesMap<B>);
}

type Orientation = "portrait" | "landscape";

export function resolveOrientation(orientation?: Orientation) {
  let orientationQuery = "";
  if (typeof orientation !== "undefined") {
    orientationQuery = `and (orientation: ${orientation})`;
  }
  return orientationQuery;
}

export function createUp<B extends string>(breakpoints: BaseBreakpoints<B>) {
  return function up(bp: B, orientation?: Orientation) {
    return `@media (min-width: ${breakpoints[bp]}) ${resolveOrientation(
      orientation
    )}`;
  };
}

export function createResolveDownBp<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  return function resolveDownBp(bp: B) {
    return `${(stripUnit(breakpoints[bp]) as number) - 0.02}px`;
  };
}

export function createDown<B extends string>(breakpoints: BaseBreakpoints<B>) {
  const resolveDownBp = createResolveDownBp(breakpoints);
  return function down(bp: B, orientation?: Orientation) {
    return `@media (max-width: ${resolveDownBp(bp)}) ${resolveOrientation(
      orientation
    )}`;
  };
}

export function createOnly<B extends string>(breakpoints: BaseBreakpoints<B>) {
  const resolveDownBp = createResolveDownBp(breakpoints);
  const breakpointsArray = getBreakpointsArray(breakpoints);
  const breakpointsIndexesMap = getBreakpointsIndexesMap(breakpointsArray);

  return function only(bp: B, orientation?: Orientation) {
    const bpIndex = breakpointsIndexesMap[bp];
    const nextBp = breakpointsArray[bpIndex + 1];
    const down = nextBp ? `and (max-width: ${resolveDownBp(nextBp[0])})` : "";
    return `@media (min-width: ${breakpoints[bp]}) ${down} ${resolveOrientation(
      orientation
    )}`;
  };
}

export function createBetween<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const resolveDownBp = createResolveDownBp(breakpoints);
  return function between(bp1: B, bp2: B, orientation?: Orientation) {
    return `@media (min-width: ${
      breakpoints[bp1]
    }) and (max-width: ${resolveDownBp(bp2)}) ${resolveOrientation(
      orientation
    )}`;
  };
}

export function createSortValuesByBp<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const breakpointsArray = getBreakpointsArray(breakpoints);
  const breakpointsIndexesMap = getBreakpointsIndexesMap(breakpointsArray);

  return function sortValuesByBp<T>(values: [B, T][]) {
    return values.sort((a, b) => {
      const aBp = a[0];
      const bBp = b[0];
      return breakpointsIndexesMap[aBp] - breakpointsIndexesMap[bBp];
    });
  };
}
