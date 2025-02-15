import stylelint, { type LinterResult, type LintResult, type Severity, type Warning } from 'stylelint';
import type { TestCase, TestCaseExpectation } from './type';

/**
 * The `ConfigVerifier` class verifies the rules of a Stylelint configuration. It runs Stylelint for a given test case
 * and compares the linter result with the expected result. The test case contains the code that should be linted and
 * the expected result. The expected result contains the expected error status, messages, and severities.
 *
 * @example
 * ```typescript
 * new ConfigVerifier().verify(
 *   'at-rule-disallowed-list',
 *   {
 *     name: 'Disallow @debug rule',
 *     code: '@debug "";',
 *     expect: {
 *       errored: true,
 *       messages: ['Unexpected at-rule "debug"'],
 *       severities: ['error'],
 *     },
 *   },
 *   {
 *     name: 'Allow @use rule',
 *     code: '@use "test.scss";',
 *   },
 * );
 * ``
 */
export class ConfigVerifier {
  /**
   * The default test case expectation
   *
   * This expectation occurs if Stylelint reports no problems and is used if no expectation was defined in a test case.
   *
   * @type {TestCaseExpectation}
   *
   * @internal
   */
  protected readonly defaultExpectation: TestCaseExpectation = {
    errored: false,
    messages: [],
    severities: [],
  };

  /**
   * Creates a new `ConfigVerifier` object.
   *
   * @param {string} configFile The path to the Stylelint config file whose rules should be verified
   */
  public constructor(protected readonly configFile: string = '.stylelintrc.yaml') {}

  /**
   * Verifies a rule configuration.
   *
   * @param {string} ruleName The name of the rule
   * @param {TestCase[]} testCases The test cases
   */
  public verify(ruleName: string, ...testCases: TestCase[]): void {
    describe(`Rule '${ruleName}'`, (): void => {
      test.each(testCases)('$name', async (testCase: TestCase): Promise<void> => {
        const warnings: Warning[] = this.getWarnings(ruleName, await this.getLinterResult(testCase));
        const { expect: expectation = this.defaultExpectation }: TestCase = testCase;

        expect(this.getErrored(warnings)).toBe(expectation.errored);
        expect(this.getMessages(warnings)).toStrictEqual(
          expectation.messages.map((message: string): string => `${message} (${ruleName})`),
        );
        expect(this.getSeverities(warnings)).toStrictEqual(expectation.severities);
      });
    });
  }

  /**
   * Runs Stylelint for the given test case and returns a Promise that resolves to the linter result.
   *
   * @internal
   *
   * @param {TestCase} testCase The test case
   *
   * @return {Promise<LinterResult>}
   */
  protected getLinterResult({ file, code }: TestCase): Promise<LinterResult> {
    if ([file, code].filter((value: string | undefined): boolean => value === undefined).length !== 1) {
      throw new Error('Though both "file" and "code" are optional, you must have one and cannot have both.');
    }

    return stylelint.lint({
      configFile: this.configFile,
      files: file,
      code,
    });
  }

  /**
   * Returns the warnings for a rule from the given linter result.
   *
   * @internal
   *
   * @param {string} ruleName The name of the rule
   * @param {LinterResult} linterResult The linter result
   *
   * @return {Warning[]}
   */
  protected getWarnings(ruleName: string, { results: lintResults }: LinterResult): Warning[] {
    return lintResults
      .map(({ warnings }: LintResult): Warning[] => warnings)
      .reduce((previous: Warning[], current: Warning[]): Warning[] => previous.concat(current), [])
      .filter((warning: Warning): boolean => warning.rule === ruleName);
  }

  /**
   * Returns true if the given lint warnings contain an error, otherwise false.
   *
   * @internal
   *
   * @param {Warning[]} warnings The lint warnings
   *
   * @return {boolean}
   */
  protected getErrored(warnings: Warning[]): boolean {
    return this.getSeverities(warnings).some((severity: Severity): boolean => severity === 'error');
  }

  /**
   * Returns the messages of the given lint warnings.
   *
   * @internal
   *
   * @param {Warning[]} warnings The lint warnings
   *
   * @return {string[]}
   */
  protected getMessages(warnings: Warning[]): string[] {
    return warnings.map(({ text }: Warning): string => text);
  }

  /**
   * Returns the severities of the given lint warnings.
   *
   * @internal
   *
   * @param {Warning[]} warnings The lint warnings
   *
   * @return {Severity[]}
   */
  protected getSeverities(warnings: Warning[]): Severity[] {
    return warnings.map(({ severity }: Warning): Severity => severity);
  }
}
