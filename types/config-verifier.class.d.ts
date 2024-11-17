import type { TestCase } from './type';

/**
 * ConfigVerifier class
 */
export declare class ConfigVerifier {
  /**
   * Creates and initializes an object instance of the class.
   *
   * @param {string} configFile The path to the Stylelint config file whose rules should be verified
   */
  constructor(configFile?: string);

  /**
   * Verifies a rule configuration.
   *
   * @param {string} ruleName The name of the rule
   * @param {TestCase[]} testCases The test cases
   */
  verify(ruleName: string, ...testCases: TestCase[]): void;
}
