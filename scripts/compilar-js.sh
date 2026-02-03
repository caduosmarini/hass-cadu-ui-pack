#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="${ROOT_DIR}/tools"
ESBUILD_PATH="${TOOLS_DIR}/esbuild"
ENTRY="${ROOT_DIR}/src/hass-cadu-ui-pack.entry.js"
OUTPUT="${ROOT_DIR}/hass-cadu-ui-pack.js"

if [[ ! -f "${ESBUILD_PATH}" ]]; then
  echo "Baixando esbuild..."
  mkdir -p "${TOOLS_DIR}"
  ESBUILD_VERSION="0.24.2"
  curl -fsSL "https://github.com/evanw/esbuild/releases/download/v${ESBUILD_VERSION}/esbuild-linux-64.tgz" -o "${TOOLS_DIR}/esbuild.tgz"
  tar -xzf "${TOOLS_DIR}/esbuild.tgz" -C "${TOOLS_DIR}"
  mv "${TOOLS_DIR}/package/bin/esbuild" "${ESBUILD_PATH}"
  rm -rf "${TOOLS_DIR}/package" "${TOOLS_DIR}/esbuild.tgz"
  chmod +x "${ESBUILD_PATH}"
fi

echo "Compilando bundle..."
"${ESBUILD_PATH}" "${ENTRY}" \
  --bundle \
  --minify \
  --format=esm \
  --target=es2018 \
  --outfile="${OUTPUT}"

echo "Bundle gerado em ${OUTPUT}"
