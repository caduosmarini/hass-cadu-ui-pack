# Google Maps Card Cadu1

Cartao customizado do Home Assistant para exibir entidades no Google Maps com caixas de informacao, direcao e velocidade.

## Instalacao (HACS)

1. Adicione este repositorio como **Custom Repository** no HACS (categoria: Lovelace).
2. Instale o cartao.
3. Adicione o recurso no Lovelace em **Configuracao > Painel > Recursos**:

```
/url/google-maps-card-cadu1.js
```

## Configuracao

```yaml
type: "custom:google-maps-card-cadu1"
api_key: "SUA_GOOGLE_MAPS_API_KEY"
follow_entity: input_boolean.seguir_mapa
modo_noturno: input_boolean.modo_noturno
transito: input_boolean.transito
entities:
  - entity: device_tracker.meu_dispositivo
    condition: input_boolean.mostrar_dispositivo
    velocidade: sensor.velocidade_dispositivo
    altitude: sensor.altitude_dispositivo
```

### Opcoes

- `api_key`: Chave da API do Google Maps.
- `follow_entity`: Entidade booleana que, quando ligada, ajusta/centraliza o mapa.
- `modo_noturno`: Entidade booleana para aplicar o estilo noturno.
- `transito`: Entidade booleana para mostrar a camada de transito.
- `entities`: Lista de entidades para exibir.
  - `entity`: Entidade com latitude/longitude.
  - `condition`: Entidade booleana que controla se o marcador aparece.
  - `velocidade`: Sensor de velocidade para mostrar na caixa de info.
  - `altitude`: Sensor de altitude para mostrar na caixa de info.

## Desenvolvimento

O arquivo principal do cartao fica em `google-maps-card-cadu1.js`.
