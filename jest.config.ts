import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

export default config;
