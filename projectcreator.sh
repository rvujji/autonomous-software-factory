#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-specs}"
mkdir -p "$TARGET_DIR"

touch "$TARGET_DIR/01-artifact-runtime-specification.md"
touch "$TARGET_DIR/02-engine-runtime-specification.md"
touch "$TARGET_DIR/03-pipeline-runtime-specification.md"
touch "$TARGET_DIR/04-engine-registry-specification.md"
touch "$TARGET_DIR/05-execution-runtime-specification.md"
touch "$TARGET_DIR/06-storage-manager-specification.md"
touch "$TARGET_DIR/07-backend-manager-specification.md"
touch "$TARGET_DIR/08-configuration-manager-specification.md"
touch "$TARGET_DIR/09-logging-manager-specification.md"
touch "$TARGET_DIR/10-cli-runtime-specification.md"