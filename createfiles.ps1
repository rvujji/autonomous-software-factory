$files = @(
  "artifact\artifact.ts",
  "artifact\artifact-reference.ts",
  "artifact\artifact-store.ts",
  "artifact\artifact-metadata.ts",
  "engine\engine.ts",
  "engine\engine-context.ts",
  "engine\engine-result.ts",
  "engine\engine-metadata.ts",
  "pipeline\pipeline.ts",
  "pipeline\pipeline-step.ts",
  "pipeline\pipeline-context.ts",
  "pipeline\pipeline-result.ts",
  "execution\execution.ts",
  "execution\execution-state.ts",
  "execution\execution-summary.ts",
  "backend\backend.ts",
  "backend\backend-request.ts",
  "backend\backend-response.ts",
  "backend\backend-status.ts",
  "registry\engine-registry.ts",
  "registry\backend-registry.ts",
  "storage\storage-provider.ts",
  "storage\storage-result.ts",
  "configuration\configuration-provider.ts",
  "logging\logger.ts",
  "logging\log-event.ts"
)

$files | ForEach-Object {
  $dir = Split-Path $_ -Parent
  if ($dir) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  New-Item -ItemType File -Path $_ -Force | Out-Null
}