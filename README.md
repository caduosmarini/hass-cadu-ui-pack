# Hass Cadu UI Pack

Pacote de cards customizados para Home Assistant. Cada card fica em uma pasta,
com README proprio e entrypoint modular.

Repositorio: https://github.com/caduosmarini/hass-cadu-ui-pack

## Cards disponiveis

- **Google Maps Car Card Cadu**  
  Exibe entidades no Google Maps com caixas de info, direcao, velocidade e rastro.  
  Documentacao: `google-maps-car-card-cadu/README.md`
- **Picture Overview Cadu**  
  Imagem com titulo e entidades em overlay no estilo picture-glance.  
  Documentacao: `picture-overview-cadu/README.md`

## Instalacao (HACS)

1. Adicione este repositorio como **Custom Repository** no HACS (categoria: Lovelace).
2. Instale o pacote.
3. Adicione os recursos no Lovelace em **Configuracao > Painel > Recursos**:

```yaml
# Hass Cadu UI Pack (carrega todos os cards)
url: /hacsfiles/hass-cadu-ui-pack/hass-cadu-ui-pack.js
type: module
```

Se instalar manualmente em `/www`, use `url: /local/hass-cadu-ui-pack.js`.

## Desenvolvimento

- Cada card tem sua propria pasta e README.
- O entrypoint publicado fica em `hass-cadu-ui-pack.js`.
- Para testar localmente, abra `test-card.html` e ajuste a API Key.
- Guia de desenvolvimento: `README-dev.md`.

## Release

Use o script `scripts/create-release.ps1` (requer `git` e `gh`) com a working tree limpa.
