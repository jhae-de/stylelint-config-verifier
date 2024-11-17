#!/bin/bash

rm -rf ./dist/cjs/type ./dist/esm/type

cat >./dist/cjs/package.json <<EOF
{
  "type": "commonjs"
}
EOF

cat >./dist/esm/package.json <<EOF
{
  "type": "module"
}
EOF
