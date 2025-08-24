module.exports = {
  preset: 'react-app',
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/pages$': '<rootDir>/src/pages',
    '^@/components$': '<rootDir>/src/components',
    '^@/contexts$': '<rootDir>/src/contexts', 
    '^@/types$': '<rootDir>/src/types',
    '^@/hooks$': '<rootDir>/src/hooks',
    '^@/utils$': '<rootDir>/src/utils',
    '^@/constants$': '<rootDir>/src/constants',
    '^@/providers$': '<rootDir>/src/providers',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['react-app'] }]
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
