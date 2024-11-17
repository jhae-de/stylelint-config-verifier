![Version](https://img.shields.io/npm/v/%40jhae/stylelint-config-verifier?label=Version)
![License](https://img.shields.io/github/license/jhae-de/stylelint-config-verifier?label=License&color=lightgrey)
![Tests](https://img.shields.io/github/actions/workflow/status/jhae-de/stylelint-config-verifier/analyze.yaml?label=Tests)
![Coverage](https://img.shields.io/codecov/c/github/jhae-de/stylelint-config-verifier/main?label=Coverage)

# Stylelint Config Verifier

Does your [Stylelint](https://github.com/stylelint/stylelint) configuration meet your expectations? Easily test
individual rules with [Jest](https://github.com/jestjs/jest) using code snippets and ensure that errors and warnings are
being reported correctly.

## Installation

Using npm:

```shell
npm install --save-dev @jhae/stylelint-config-verifier
```

## Usage

### With inline code

Example Stylelint configuration file:

```yaml
rules:
  at-rule-disallowed-list:
    - debug
    - import
```

Verifying the `at-rule-disallowed-list` rule configuration:

```javascript
import { ConfigVerifier } from '@jhae/stylelint-config-verifier';

new ConfigVerifier().verify(
  // Pass the name of the rule.
  'at-rule-disallowed-list',

  // Describe one or more test cases.
  {
    // Give the test case a name.
    name: 'Disallow @debug rule',

    // Place the code to be tested against the configuration file here.
    code: '@debug "";',

    // Define the expectation.
    expect: {
      // Whether Stylelint should report an error or not.
      errored: true,

      // The messages that Stylelint should report.
      messages: ['Unexpected at-rule "debug"'],

      // The severities that Stylelint should report for each message.
      severities: ['error'],
    },
  },
  {
    name: 'Disallow @import rule',
    code: `
      @import "test-1.css";
      @import "test-2.css";
    `,
    expect: {
      errored: true,
      messages: ['Unexpected at-rule "import"', 'Unexpected at-rule "import"'],
      severities: ['error', 'error'],
    },
  },
  {
    // The expectation can be omitted if Stylelint should not report errors.
    name: 'Allow @use rule',
    code: '@use "test.scss";',
  },
);
```

The verification result:

```shell
Rule 'at-rule-disallowed-list'
  ✓ Disallow @debug rule (1 ms)
  ✓ Disallow @import rule (1 ms)
  ✓ Allow @use rule (1 ms)
```

### With a file

It is also possible to pass a file to the test case. This is useful for testing overrides, for example.

Example Stylelint configuration file:

```yaml
rules:
  at-rule-disallowed-list:
    - import

overrides:
  - files:
      - '*.css'
      - '**/*.css'
    rules:
      at-rule-disallowed-list: null
```

The CSS file, for example `at-rule-disallowed-list.css`:

```css
@import 'test.css';
```

Verifying the `at-rule-disallowed-list` rule configuration:

```javascript
import { ConfigVerifier } from '@jhae/stylelint-config-verifier';

new ConfigVerifier().verify('at-rule-disallowed-list', {
  name: 'Allow @import rule in CSS files',

  // Pass the file instead of inline code.
  file: 'at-rule-disallowed-list.css',
});
```

### Specifying the Stylelint configuration file

By default, the config verifier looks for a `.stylelintrc.yaml` configuration file. If a different location or file name
is used, the path to it can be specified as a constructor argument.

```javascript
import { ConfigVerifier } from '@jhae/stylelint-config-verifier';

new ConfigVerifier('path/to/stylelint.config.js').verify();
```

### Importing into CommonJS

```javascript
const { ConfigVerifier } = require('@jhae/stylelint-config-verifier');

new ConfigVerifier().verify();
```

---

Check out the [Standard SCSS Stylelint Config](https://github.com/jhae-de/stylelint-config-standard-scss) tests for more
examples.
