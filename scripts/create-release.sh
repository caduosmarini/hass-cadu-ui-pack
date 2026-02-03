#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Comando '$1' nao encontrado no PATH."
    exit 1
  fi
}

require_command git
require_command gh

origin_url="$(git remote get-url origin || true)"
expected_repo="caduosmarini/hass-cadu-ui-pack"
if [[ "${origin_url}" != *"${expected_repo}"* ]]; then
  echo "Aviso: origin atual nao parece ser '${expected_repo}'. URL: ${origin_url}"
fi

last_tag="$(git tag --sort=-creatordate | head -n 1)"
if [[ -z "${last_tag}" ]]; then
  last_tag="<nenhuma>"
fi
echo "Ultima tag: ${last_tag}"

read -r -p "Nome da nova tag/release: " tag_name
if [[ -z "${tag_name}" ]]; then
  echo "Nome da tag nao pode ser vazio."
  exit 1
fi

if git tag --list "${tag_name}" | grep -q .; then
  echo "Tag '${tag_name}' ja existe."
  exit 1
fi

"${ROOT_DIR}/scripts/compilar-js.sh"

git add -A
if git status --porcelain | grep -q '^'; then
  git commit -m "Release ${tag_name}"
else
  echo "Sem alteracoes para commit apos o build."
  exit 1
fi

git tag -a "${tag_name}" -m "${tag_name}"
git push origin "${tag_name}"
gh release create "${tag_name}" --title "${tag_name}" --generate-notes

echo "Release criada: ${tag_name}"
