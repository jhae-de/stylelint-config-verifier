import type { TestCase } from './type';

/**
 * The `ConfigVerifier` class verifies the rules of a Stylelint configuration. It runs Stylelint for a given test case
 * and compares the linter result with the expected result. The test case contains the code that should be linted and
 * the expected result. The expected result contains the expected error status, messages, and severities.
 *
 * @example
 * ```javascript
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
export declare class ConfigVerifier {
  /**
   * Creates a new `ConfigVerifier` object.
   *
   * @param {string} configFile - The path to the Stylelint config file whose rules should be verified
   */
  constructor(configFile?: string);

  /**
   * Verifies a rule configuration.
   *
   * @param {string} ruleName - The name of the rule
   * @param {TestCase[]} testCases - The test cases
   */
  verify(ruleName: string, ...testCases: TestCase[]): void;
}
