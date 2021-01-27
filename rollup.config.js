import { readFileSync } from "fs";
import common from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import yaml from "rollup-plugin-yaml";
import esbuild from "rollup-plugin-esbuild";

var banner = readFileSync("./scripts/banner.js", "utf-8");
// var dependencies = process.env.DEPS === "YES";

function recursivelyDeleteNominatimUrl(data) {
  if (typeof data === "object") {
    Object.values(data).forEach(recursivelyDeleteNominatimUrl);
  }
  delete data._nominatim_url;
  return data;
}

var yamlPlugin = yaml({
  transform(data) {
    return recursivelyDeleteNominatimUrl(data);
  },
});

const esbuildPlugin = esbuild({
  minify: true,
  loaders: {
    ".json": "json",
  },
});

export default [
  {
    input: "./src/index.js",
    plugins: [yamlPlugin, nodeResolve(), common()],
    output: {
      name: "opening_hours",
      banner: banner,
      format: "umd",
      file: "build/opening_hours+deps.js",
    },
  },
  {
    input: "./src/index.js",
    plugins: [yamlPlugin, nodeResolve(), common(), esbuildPlugin],
    output: {
      name: "opening_hours",
      banner: banner,
      format: "umd",
      file: "build/opening_hours+deps.min.js",
    },
  },
  {
    input: "./src/index.js",
    plugins: [yamlPlugin],
    external: ["i18next-client", "suncalc"],
    output: {
      name: "opening_hours",
      banner: banner,
      globals: {
        "i18next-client": "i18n",
        suncalc: "SunCalc",
      },
      format: "umd",
      file: "build/opening_hours.js",
    },
  },
  {
    input: "./src/index.js",
    plugins: [yamlPlugin, esbuildPlugin],
    external: ["i18next-client", "suncalc"],
    output: {
      name: "opening_hours",
      banner: banner,
      globals: {
        "i18next-client": "i18n",
        suncalc: "SunCalc",
      },
      format: "umd",
      file: "build/opening_hours.min.js",
    },
  },
];
