import stripUnit from "./stripUnit";

const stripAsNumber = (value: string) => stripUnit(value) as number;

export default function betweenFluid(
  fromSize: string,
  toSize: string,
  minScreen: string,
  maxScreen: string
) {
  const slope =
    (stripAsNumber(fromSize) - stripAsNumber(toSize)) /
    (stripAsNumber(minScreen) - stripAsNumber(maxScreen));
  const base = stripAsNumber(toSize) - slope * stripAsNumber(maxScreen);

  return `calc(${base.toFixed(2)}${fromSize || ""} + ${(100 * slope).toFixed(
    2
  )}vw)`;
}
