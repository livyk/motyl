import {
  BaseBreakpoints,
  createBetween,
  createDown,
  createOnly,
  createSortValuesByBp,
  createUp
} from "./utils";

export function createBreakpoints<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const up = createUp(breakpoints);
  const down = createDown(breakpoints);
  const only = createOnly(breakpoints);
  const between = createBetween(breakpoints);
  const sortValuesByBp = createSortValuesByBp(breakpoints);
  return { up, down, only, between, sortValuesByBp };
}
