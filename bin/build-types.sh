#!/bin/bash

rm -rf ./types
tsc --project tsconfig.types.json
mv ./types/config-verifier.class.d.ts ./types/config-verifier.d.ts
cat >./types/index.d.ts <<EOF
export type { TestCase, TestCaseExpectation } from './type';
export { ConfigVerifier } from './config-verifier.d.ts';
EOF
