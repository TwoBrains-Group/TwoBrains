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
        ecmaFeatures: {
        },
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        indent: ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],
    },
}
