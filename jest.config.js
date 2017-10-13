module.exports = {
    setupTestFrameworkScriptFile: '<rootDir>/config/setup.js',
    collectCoverageFrom: ['src/**/*.js'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/lib/',
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!d2-ui).+\\.js$',
    ],
};
