#!/usr/bin/env bash

set -euo pipefail

mkdir -p \
  src/requirements \
  src/architecture \
  src/domain \
  src/aggregates \
  src/database \
  src/backend \
  src/frontend \
  src/testing \
  src/documentation \
  tests

touch \
  package.json \
  tsconfig.json \
  README.md \
  src/index.ts \
  src/requirements/ParseRequirementsEngine.ts \
  src/requirements/ValidateRequirementsEngine.ts \
  src/architecture/GenerateArchitectureEngine.ts \
  src/domain/GenerateDomainModelEngine.ts \
  src/aggregates/GenerateAggregatesEngine.ts \
  src/database/GenerateDatabaseSchemaEngine.ts \
  src/backend/GenerateApiEngine.ts \
  src/frontend/GenerateFlutterEngine.ts \
  src/testing/GenerateTestsEngine.ts \
  src/documentation/GenerateDocumentationEngine.ts

echo "Engineering engine structure created successfully."