import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'mocks/**/*.{ts,tsx}', '!src/**/*.d.ts', '!mocks/**/*.d.ts'],
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/mocks/**/*.test.ts',
    '<rootDir>/mocks/**/*.test.tsx'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  bail: 1
};

export default createJestConfig(config);
