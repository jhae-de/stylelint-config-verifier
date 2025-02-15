#!/bin/bash

rm -rf ./types
tsc --project tsconfig.types.json
mv ./types/config-verifier.class.d.ts ./types/config-verifier.d.ts
