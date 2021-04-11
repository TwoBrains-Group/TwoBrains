module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {},
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        // Common //
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        '@typescript-eslint/indent': ['error', 4, {
            SwitchCase: 1,
        }],
        'comma-dangle': ['error', 'always-multiline'],
        'keyword-spacing': ['error', {
            before: true,
            after: true,
        }],
        'space-before-blocks': 'error',
        'object-property-newline': ['error'],
        'object-curly-newline': ['error', {
            ObjectExpression: {
                minProperties: 1,
            },
            ImportDeclaration: 'never',
        }],
        'quote-props': ['error', 'as-needed'],
        // 'require-await': 'error',

        // TS //
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
}
