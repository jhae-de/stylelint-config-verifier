import type { Severity } from 'stylelint';

export type TestCaseExpectation = {
  errored: boolean;
  messages: string[];
  severities: Severity[];
};
