import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json";

const globals = {
  react: "React",
};

export default {
  input: "src/index.ts",
  external: ["react"],
  output: [
    {
      file: `dist/${packageJson.name}.js`,
      format: "cjs",
      strict: true,
      sourcemap: true,
      exports: "named",
      globals,
    },
    {
      file: `dist/${packageJson.name}.esm.js`,
      format: "esm",
      strict: true,
      sourcemap: true,
      exports: "named",
      globals,
    },
    {
      format: "umd",
      name: "StaticStyleTools",
      file: `dist/${packageJson.name}.umd.js`,
      strict: true,
      sourcemap: false,
      exports: "named",
      globals,
    },
  ],
  plugins: [resolve(), commonjs(), typescript()],
};
