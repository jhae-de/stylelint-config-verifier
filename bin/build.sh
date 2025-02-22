#!/bin/bash

# Prepare build
rm -rf ./dist

# Build CJS
tsc --project tsconfig.cjs.json
mv ./dist/cjs/config-verifier.class.js ./dist/cjs/config-verifier.js
cat >./dist/cjs/package.json <<EOF
{
  "type": "commonjs"
}
EOF

# Build ESM
tsc --project tsconfig.esm.json
mv ./dist/esm/config-verifier.class.js ./dist/esm/config-verifier.js
cat >./dist/esm/package.json <<EOF
{
  "type": "module"
}
EOF

# Clean up
rm -rf ./dist/{cjs,esm}/type
