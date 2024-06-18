module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [
        "<rootDir>/setupTests.js"
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
        "^.+\\.css$": "<rootDir>/cssTransform.js",
        "^(?!.*\\.(js|jsx|css|json)$)": "<rootDir>/fileTransform.js"
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "\\.pnp\\.[^\\/]+$"
    ],
};
