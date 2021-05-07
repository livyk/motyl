import { Properties } from "csstype";
import { createBreakpoints } from "../breakpoints";
import {
  BaseBreakpoints,
  getBreakpointsArray,
  getBreakpointsIndexesMap
} from "../breakpoints/utils";
import betweenFluid from "../helpers/betweenFluid";
import { Styles } from "../interfaces";

type FluidValue = string;
type Property = keyof Properties;
type RuleKey<B extends string> = B | [B, B] | Property;
type RuleValue = Styles | string;
type RuleTuple<B extends string> = [RuleKey<B>, RuleValue];
type RulesArray<B extends string> = Array<RuleTuple<B>>;
type FluidValues<B extends string> = Partial<Record<B, FluidValue>>;

export function createFluidRulesArray<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const { sortValuesByBp } = createBreakpoints(breakpoints);
  return function fluidRulesArray(
    prop: Property,
    values: FluidValues<B>,
    styles: RulesArray<B> = []
  ) {
    const sortedFluidValuesArray = sortValuesByBp(
      Object.entries(values) as [B, FluidValue][]
    );

    sortedFluidValuesArray.forEach(([bp, size], index) => {
      if (index === 0) {
        styles.push([prop, size]);
      }

      if (index === sortedFluidValuesArray.length - 1) {
        styles.push([bp, { [prop]: size }]);
      } else {
        const [nextBp, nextSize] = sortedFluidValuesArray[index + 1];
        const fromScreen = breakpoints[bp];
        const toScreen = breakpoints[nextBp];

        styles.push([
          [bp, nextBp],
          {
            [prop]: betweenFluid(size, nextSize, fromScreen, toScreen),
          },
        ]);
      }
    });
    return styles;
  };
}

type FluidStyles<B extends string> = Partial<Record<Property, FluidValues<B>>>;

export function createFluidStyle<B extends string>(
  breakpoints: BaseBreakpoints<B>
) {
  const fluidRulesArray = createFluidRulesArray(breakpoints);
  const breakpointsIndexes = getBreakpointsIndexesMap(
    getBreakpointsArray(breakpoints)
  );

  function getRuleScores(rule: RuleTuple<B>) {
    const isTuple = Array.isArray(rule[0]);
    const key = isTuple ? (rule[0][0] as B) : (rule[0] as B);
    const breakpointIndex = breakpointsIndexes[key];
    const isBreakpoint = typeof breakpointIndex === "number";

    //key is css prop. set it on start of the rule
    if (!isBreakpoint) {
      return 100;
    }

    if (isTuple) {
      return 10 - breakpointIndex;
    }
    return -breakpointIndex;
  }

  function rulesComparator(a: RuleTuple<B>, b: RuleTuple<B>) {
    //if it's breakpoints tuple, use smallest breakpoints as a key

    return getRuleScores(b) - getRuleScores(a);
  }

  const { up, between } = createBreakpoints(breakpoints);

  function extendMediaRule(key: string, value: Styles, styles: Styles) {
    const currentRule = styles[key] ?? {};
    styles[key] = { ...(currentRule as Styles), ...value };
  }

  function applyStyleRuleToStyles(rulesTuple: RuleTuple<B>, styles: Styles) {
    const [key, value] = rulesTuple;

    if (Array.isArray(key)) {
      const [from, to] = key;
      extendMediaRule(between(from, to), value as Styles, styles);
    } else if (breakpointsIndexes[key as B] !== undefined) {
      extendMediaRule(up(key as B), value as Styles, styles);
    } else {
      styles[key] = value;
    }
  }

  return function fluidStyle(style: FluidStyles<B>) {
    const rulesArray = [] as RulesArray<B>;
    (Object.keys(style) as Property[]).forEach((prop) => {
      fluidRulesArray(prop, style[prop]!, rulesArray);
    });

    rulesArray.sort(rulesComparator);

    return rulesArray.reduce((styles, rule) => {
      applyStyleRuleToStyles(rule, styles);
      return styles;
    }, {} as Styles);
  };
}
