import stylelint, { LinterResult } from 'stylelint';
import { ConfigVerifier } from './config-verifier.class';
import mocked = jest.mocked;
import ResolvedValue = jest.ResolvedValue;

jest.mock('stylelint');

describe('ConfigVerifier class', (): void => {
  test('Constructor', (): void => {
    expect(new ConfigVerifier()['configFile']).toBe('.stylelintrc.yaml');
    expect(new ConfigVerifier('stylelint.config.js')['configFile']).toBe('stylelint.config.js');
  });
});

describe('ConfigVerifier class', (): void => {
  describe('Errors', (): void => {
    const expectedError: Error = new Error(
      'Though both "file" and "code" are optional, you must have one and cannot have both.',
    );

    test('Without both "file" and "code"', (): void => {
      expect((): void => {
        void new ConfigVerifier()['getLinterResult']({
          name: '',
        });
      }).toThrow(expectedError);
    });

    test('With both "file" and "code"', (): void => {
      expect((): void => {
        void new ConfigVerifier()['getLinterResult']({
          name: '',
          file: '',
          code: '',
        });
      }).toThrow(expectedError);
    });
  });
});

describe('ConfigVerifier class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [
        {
          warnings: [
            {
              rule: '_rule_name_',
              text: `_linter_result_message_ (_rule_name_)`,
              severity: 'error',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  new ConfigVerifier().verify('_rule_name_', {
    name: '_test_case_1_',
    code: '_test_case_code_',
    expect: {
      errored: true,
      messages: ['_linter_result_message_'],
      severities: ['error'],
    },
  });
});

describe('ConfigVerifier class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [
        {
          warnings: [
            {
              rule: '_rule_name_',
              text: `_linter_result_message_ (_rule_name_)`,
              severity: 'warning',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  new ConfigVerifier().verify('_rule_name_', {
    name: '_test_case_2_',
    code: '_test_case_code_',
    expect: {
      errored: false,
      messages: ['_linter_result_message_'],
      severities: ['warning'],
    },
  });
});

describe('ConfigVerifier class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [],
    } as ResolvedValue<LinterResult>);
  });

  new ConfigVerifier().verify('_rule_name_', {
    name: '_test_case_3_',
    code: '_test_case_code_',
  });

  new ConfigVerifier().verify('_rule_name_', {
    name: '_test_case_4_',
    file: '_test_case_file_',
  });
});
