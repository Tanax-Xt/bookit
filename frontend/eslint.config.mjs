import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import solidPlugin from "eslint-plugin-solid";
import typescriptPlugin from "typescript-eslint";

/** @type {import("@typescript-eslint/utils/ts-eslint").FlatConfig.Config[]} */
export default [
  {
    ignores: ["node_modules", "*dist", "/test-results/", "/playwright-report/", "/blob-report/", "/playwright/.cache/"],
  },
  ...typescriptPlugin.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ["**/*.{ts,tsx}"],
    ...solidPlugin.configs["flat/typescript"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "no-console": "warn",

      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
          "newlines-between": "always",
          warnOnUnassignedImports: false,
          pathGroups: [
            {
              pattern: "**/*.css",
              group: "type",
              position: "before",
            },
          ],
          groups: ["type", "builtin", "external", "internal", ["parent", "sibling"], "index"],
        },
      ],

      "import/no-unresolved": [
        "error",
        {
          ignore: ["^~icons/"],
        },
      ],
      "import/default": "off",
      "import/namespace": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/triple-slash-reference": "off",

      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
        },
      ],

      "solid/reactivity": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: true,
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
    },
  },
];
