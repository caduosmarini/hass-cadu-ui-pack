# Picture Overview Cadu

Card customizado do Home Assistant para mostrar uma imagem com titulo e entidades em overlay, no estilo do picture-glance.

Repositorio: https://github.com/caduosmarini/hass-cadu-ui-pack

## Instalacao (HACS)

1. Adicione este repositorio como **Custom Repository** no HACS (categoria: Lovelace).
2. Instale o pacote.
3. Adicione o recurso no Lovelace em **Configuracao > Painel > Recursos**:

```yaml
url: /hacsfiles/hass-cadu-ui-pack/hass-cadu-ui-pack.js
type: module
```

Se instalar manualmente em `/www`, use `url: /local/hass-cadu-ui-pack.js`.

## Configuracao (YAML)

```yaml
type: "custom:picture-overview-cadu"
title: Office • Dining • Kitchen • Laundry
aspect_ratio: "1.5"
fit_mode: cover
camera_view: auto
tap_action:
  action: navigate
  navigation_path: /lovelace/dining
image:
  media_content_id: /local/areas/dining2.png
entities:
  - entity: sensor.nspaneloffice_temperature
    show_state: true
```

Outro exemplo usando image_entity:

```yaml
type: "custom:picture-overview-cadu"
title: Garagem • Cars
aspect_ratio: "1.5"
fit_mode: cover
camera_view: auto
tap_action:
  action: navigate
  navigation_path: /lovelace/garagem
image_entity: image.garagem_image
entities: []
```

## Configuracao (UI)

O editor visual do card apresenta as mesmas opcoes do YAML: imagem (url/local ou media_content_id), entidade de imagem, aspect ratio, fit mode, camera view, tap action e lista de entidades (a primeira com `show_state: true` aparece no overlay).

## Opcoes

- `title`: Titulo do card.
- `title_icon`: Icone ao lado do titulo (opcional).
- `image`: URL/arquivo local da imagem (opcional). Tambem aceita objeto com `media_content_id`.
- `image_media_content_id`: Alternativa de UI para preencher `image.media_content_id`.
- `image_entity`: Entidade de imagem/camera (opcional).
- `aspect_ratio`: Relacao de aspecto (`1.5`, `16:9`, etc). Padrao: `1.5`.
- `fit_mode`: `cover` ou `contain`. Padrao: `cover`.
- `camera_view`: `auto` ou `live`. Padrao: `auto`.
- `tap_action`: Acao ao tocar na imagem.
- `entities`: Lista de entidades para exibir (overlay usa todas com `show_state: true`).
  - `position`: `bottom` (barra inferior) ou `top` (canto superior direito).
  - `decimals`: Numero de casas decimais quando o estado for numerico (padrao: 1).
  - `entity`: Entidade.
  - `name`: Nome customizado (opcional).
  - `icon`: Icone customizado (opcional).
  - `show_state`: Exibe o estado da entidade.
  - `tap_action`: Acao ao tocar na entidade (opcional).

## Desenvolvimento

O entrypoint publicado fica em `hass-cadu-ui-pack.js`.
