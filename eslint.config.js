import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// Softgem-standard ESLint flat config.
// Extends: eslint recommended + typescript-eslint recommended.
// Plugins: react-hooks (rules-of-hooks + exhaustive-deps), react-refresh
// (fast-refresh guardrails for Vite HMR).
export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.tsbuildinfo"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Turn on `unknown` at boundaries instead of `any`.
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow `_prefixed` unused params (matches Loan convention).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  }
);
