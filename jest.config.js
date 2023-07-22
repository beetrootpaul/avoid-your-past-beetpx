/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "./src/",
  preset: "ts-jest",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: {
          // Fix for JS files imported by TS files. Taken from https://github.com/kulshekhar/ts-jest/issues/970#issuecomment-1014215089
          allowJs: true,
        },
      },
    ],
  },
};
