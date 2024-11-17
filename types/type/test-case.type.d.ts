import type { TestCaseExpectation } from './index';

export type TestCase = {
  name: string;
  file?: string;
  code?: string;
  expect?: TestCaseExpectation;
};
