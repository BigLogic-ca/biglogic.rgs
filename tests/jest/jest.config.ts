import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  rootDir: '../../',
  displayName: 'CLIENT',
  verbose: true,
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/tests/jest/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'ES2020'
      }
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(memorio|immer|dphelper.types)/)'
  ]
}

export default config
