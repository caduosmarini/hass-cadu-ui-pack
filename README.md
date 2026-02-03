# Hass Cadu UI Pack

Pacote de cards customizados para Home Assistant. Cada card fica em uma pasta,
com README proprio e entrypoint modular.

Repositorio: https://github.com/caduosmarini/hass-cadu-ui-pack

## Cards disponiveis

- **Google Maps Car Card Cadu**  
  Exibe entidades no Google Maps com caixas de info, direcao, velocidade e rastro.  
  Documentacao: `google-maps-car-card-cadu/README.md`

## Instalacao (HACS)

1. Adicione este repositorio como **Custom Repository** no HACS (categoria: Lovelace).
2. Instale o pacote.
3. Adicione os recursos no Lovelace em **Configuracao > Painel > Recursos**:

```yaml
# Google Maps Car Card Cadu
url: /hacsfiles/hass-cadu-ui-pack/google-maps-car-card-cadu/index.js
type: module
```

Se instalar manualmente em `/www`, use `url: /local/google-maps-car-card-cadu/index.js`.

## Desenvolvimento

- Cada card tem sua propria pasta e README.
- O entrypoint de cada card fica em `index.js` dentro da pasta do card.
- Para testar localmente, abra `test-card.html` e ajuste a API Key.

## Release

Use o script `scripts/create-release.ps1` (requer `git` e `gh`) com a working tree limpa.
