# Dev Guide

Guia rapido para desenvolvimento local do pacote.

## Estrutura

- `dist/`: fontes dos cards consumidas no bundle.
- `src/hass-cadu-ui-pack.entry.js`: entrypoint do bundle.
- `hass-cadu-ui-pack.js`: bundle final (minificado).
- `scripts/compilar-js.*`: build do bundle.
- `scripts/create-release.*`: build + commit + tag + release.

## Build manual

Windows (PowerShell):

```bash
.\scripts\compilar-js.ps1
```

Linux/macOS:

```bash
./scripts/compilar-js.sh
```

O bundle final fica em `hass-cadu-ui-pack.js`.

## Release

Windows (PowerShell):

```bash
.\scripts\create-release.ps1
```

Linux/macOS:

```bash
./scripts/create-release.sh
```

O script:
- compila o bundle
- faz commit
- cria tag
- publica release no GitHub
