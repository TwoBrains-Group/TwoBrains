module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'plugin:nuxt/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    plugins: [
        'import',
    ],
    rules: {
        // Common //
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        indent: ['error', 4],
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

        // Client //
        'import/newline-after-import': ['error', {
            count: 1,
        }],
        'import/no-unresolved': 0,
    },
}
