import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import noVisualTailwindOutsideAtoms from "./eslint-rules/no-visual-tailwind-outside-atoms.mjs";
import noBarrelFiles from "./eslint-rules/no-barrel-files.mjs";

export default defineConfig([
  globalIgnores(["**/dist/**"]),
  // base TS/JS for everything
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
  },

  // globals per package
  {
    files: ["backend/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["frontend/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["shared/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  // React — frontend only
  {
    files: ["frontend/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },

  // Tailwind atoms — visual classes only inside src/lib/components/
  {
    files: ["frontend/src/**/*.{ts,tsx}"],
    plugins: {
      "tailwind-atoms": {
        rules: {
          "no-visual-tailwind-outside-atoms": noVisualTailwindOutsideAtoms,
        },
      },
    },
    rules: {
      "tailwind-atoms/no-visual-tailwind-outside-atoms": "warn",
    },
  },

  // No barrel files — import directly from source modules
  {
    files: ["frontend/src/**/*.{ts,tsx}"],
    plugins: {
      "project-structure": {
        rules: {
          "no-barrel-files": noBarrelFiles,
        },
      },
    },
    rules: {
      "project-structure/no-barrel-files": "error",
    },
  },

  // non-JS files
  {
    files: ["**/*.json"],
    ignores: [
      ".devcontainer/**",
      "frontend/tsconfig*.json",
      "tsconfig.base.json",
    ],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: [
      ".devcontainer/*.json",
      "frontend/tsconfig*.json",
      "tsconfig.base.json",
    ],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      "css/font-family-fallbacks": "off", // false positive on `font-family: inherit`
      "css/no-invalid-properties": "off", // false positive on CSS custom properties (var(--foo))
      "css/use-baseline": [
        "error",
        { available: "widely", allowProperties: ["resize"] },
      ], // resize: none has no baseline alternative for suppressing textarea drag handle
    },
  },
]);
