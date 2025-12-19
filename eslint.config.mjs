// eslint.config.mjs
// Strict, production-leaning ESLint config for MV3 WebExtension + TypeScript (flat config, ESM).

import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default defineConfig([
  /**
   * 1) Typed linting (requires type information).
   */
  {
    files: ["src/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
            properties: true,
          },
        },
      ],
      "@typescript-eslint/require-await": "error",

      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: true,
          allowNullableString: false,
          allowNullableNumber: false,
        },
      ],

      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-non-null-assertion": "error",

      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
    },
  },

  /**
   * 2) TS rules that do NOT require full type information.
   */
  {
    files: ["src/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  /**
   * 3) General JS/TS quality rules.
   */
  {
    files: ["src/**/*.{ts,tsx,js,jsx}", "scripts/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-var": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
          ignoreReadBeforeAssign: false,
        },
      ],
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "no-implicit-globals": "error",
      "no-implied-eval": "error",
      "no-alert": "error",
      "no-return-await": "error",
      "no-template-curly-in-string": "error",
      "no-unsafe-optional-chaining": "error",

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "react/jsx-key": "error",
      "react/jsx-no-target-blank": [
        "error",
        {
          allowReferrer: false,
          enforceDynamicLinks: "always",
        },
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  /**
   * 4) Global ignores.
   */
  globalIgnores([
    "dist/**",
    "build/**",
    "coverage/**",
    ".web-ext-artifacts/**",
    "*.tsbuildinfo",
  ]),
]);
