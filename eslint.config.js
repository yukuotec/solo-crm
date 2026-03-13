import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "*.min.js"]),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: "19.0",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);
