/**
 * This script generates TypeScript types from an OpenAPI specification.
 *
 * Usage:
 *   node --env-file=<env-file> openapi.js <output-path>
 *
 * Example:
 *   node --env-file=.env openapi.js ./schema.d.ts
 *
 * Environment Variables:
 *   - VITE_API_URL: The URL of the OpenAPI JSON file.
 */

import fs from "fs";

import openapiTS, { astToString } from "openapi-typescript";
import prettier from "prettier";
import ts from "typescript";

const path = process.argv[2];

if (path === undefined) {
  throw new Error("No output path is provided as a CLI argument.");
}

if (process.env.VITE_API_URL === undefined) {
  throw new Error("The environment variable `VITE_API_URL` is undefined.");
}

const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());
const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Blob"));

const source = new URL("openapi.json", `${process.env.VITE_API_URL}api/`);

// eslint-disable-next-line no-console
console.info(`🔗 Using source URL for OpenAPI JSON: ${source}`);

const ast = await openapiTS(source, {
  transform: (obj) => {
    if (obj.format === "binary") {
      return obj.nullable ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
    }
  },
  rootTypes: true,
  rootTypesNoSchemaPrefix: true,
});

const output = await prettier.format(astToString(ast), {
  parser: "typescript",
});

fs.readFile(path, (_, data) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (data?.toString() === output) {
    // eslint-disable-next-line no-console
    console.info(`🔎 The schema is already up-to-date.`);
    return;
  }

  fs.writeFile(path, output, (_) => {
    const intl = Intl.NumberFormat(undefined, { style: "unit", unit: "kilobyte" });
    const size = intl.format(fs.statSync(path).size / 1024);

    // eslint-disable-next-line no-console
    console.info(`🚀 The schema has been written to ${path} (${size})`);
  });
});
