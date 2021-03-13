module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:import/errors',
        // 'plugin:import/warnings',
        // 'plugin:import/typescript',
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
        },
    },
    plugins: [
        '@typescript-eslint',
        // 'import',
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        '@typescript-eslint/indent': ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],
        // 'import/newline-after-import': ['error', {count: 1}],
        // 'import/no-unresolved': 0,
    },
}
