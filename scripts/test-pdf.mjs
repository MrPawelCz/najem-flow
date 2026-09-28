import { build } from "esbuild";
await build({
  entryPoints: ["tests/pdf.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: ".sites-runtime/pdf-test.mjs",
  packages: "external",
});
await import("../.sites-runtime/pdf-test.mjs");
