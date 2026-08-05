import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],

        languageOptions: {
            parserOptions: {
                project: true,
            },
        },

        rules: {
            "no-console": "warn",

            "@typescript-eslint/no-explicit-any": "error",

            "@typescript-eslint/explicit-function-return-type": "off",

            "@typescript-eslint/consistent-type-imports": "error",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
];