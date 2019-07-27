'use strict';

module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    "monaco-editor": "<rootDir>/node_modules/react-monaco-editor"
  },
  testRegex: '/tests/test-.*/.*.spec.ts[x]?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/dev_mode/', '/lib/', '/node_modules/'],
  automock: false,
  setupFiles: ['./setupJest.js']
};
