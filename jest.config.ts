export default {
    clearMocks: true,
    collectCoverage: false,
    collectCoverageFrom: [
        '**/*.{js,ts}',
        '!**/node_modules/**',
        '!**/tests/**'
    ],
    coverageDirectory: '<rootDir>/tests/coverage',
    coverageProvider: 'v8',
    moduleFileExtensions: ['js', 'ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests'
    ],

    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    }
}
