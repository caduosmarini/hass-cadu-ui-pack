import { normalizeEntitiesConfig } from "./config.js";

class GoogleMapsCarCardCaduEditor extends HTMLElement {
  constructor() {
    super();
    this._updating = false;
  }

  setConfig(config) {
    try {
      // Normalizar configuração ao receber ANTES de armazenar
      const normalized = this._normalizeConfig(config || {});
      this._config = normalized;
      
      // Se já está renderizado e hass está disponível, atualizar o form
      if (this._rendered && this._hass) {
        this._syncFormData();
      } else if (!this._rendered && this._hass) {
        // Se não está renderizado mas hass está disponível, renderizar
        this._render();
      }
      // Se hass ainda não está disponível, aguardar que seja setado
    } catch (error) {
      console.error("Erro ao definir configuração:", error, config);
      this._config = config || {};
      if (this._rendered && this._hass) {
        this._syncFormData();
      }
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._hass) {
      return;
    }
    
    if (this._rendered && !this._updating) {
      this._syncFormData();
    } else if (!this._rendered && this._config) {
      this._render();
    }
  }

  _render() {
    if (!this._hass) {
      return; // Não renderizar se hass não estiver disponível
    }
    
    this._rendered = true;
    this.innerHTML = "";
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    
    // Garantir que os dados estão normalizados antes de passar para o form
    const normalizedConfig = this._normalizeConfig(this._config || {});
    
    // Criar uma cópia profunda para evitar problemas de referência
    let formData;
    try {
      formData = JSON.parse(JSON.stringify(normalizedConfig));
    } catch (error) {
      console.error("Erro ao criar cópia dos dados:", error);
      formData = { ...normalizedConfig };
    }
    
    // Garantir que todos os campos esperados existam
    formData.api_key = formData.api_key || "";
    formData.follow_entity = formData.follow_entity || "";
    formData.modo_noturno = formData.modo_noturno || "";
    formData.transito = formData.transito || "";
    formData.mostrar_menu = formData.mostrar_menu !== false;
    formData.mostrar_tipo_mapa = formData.mostrar_tipo_mapa !== false;
    formData.tipo_mapa = formData.tipo_mapa || "roadmap";
    formData.mostrar_tela_cheia = formData.mostrar_tela_cheia !== false;
    formData.mostrar_controles_navegacao = formData.mostrar_controles_navegacao !== false;
    formData.ocultar_creditos = formData.ocultar_creditos === true;
    formData.transito_on = formData.transito_on === true;
    formData.modo_noturno_on = formData.modo_noturno_on === true;
    formData.seguir_on = formData.seguir_on === true;
    formData.rotacao_on = formData.rotacao_on === true;
    formData.historico_somente_rastro = formData.historico_somente_rastro !== false;
    formData.historico_carregar_no_start = formData.historico_carregar_no_start !== false;
    formData.historico_recarregar = formData.historico_recarregar === true;
    formData.historico_limite_pontos = Number.isFinite(formData.historico_limite_pontos)
      ? formData.historico_limite_pontos
      : null;
    formData.max_height = formData.max_height || null;
    formData.max_width = formData.max_width || null;
    formData.entities = formData.entities || [];
    
    form.schema = this._buildSchema();
    form.computeLabel = (schema) => schema.label || schema.name;
    
    // Definir os dados após definir o schema
    form.data = formData;
    
    form.addEventListener("value-changed", (event) => {
      if (!this._updating) {
        try {
          this._updating = true;
          this._dispatchConfigChanged(event.detail.value);
        } catch (error) {
          console.error("Erro ao processar mudança de valor:", error);
        } finally {
          // Usar setTimeout para garantir que o evento seja processado antes de resetar
          setTimeout(() => {
            this._updating = false;
          }, 100);
        }
      }
    });
    
    this.appendChild(form);
    this._form = form;
    
    // Aguardar um frame para garantir que o form está totalmente renderizado
    requestAnimationFrame(() => {
      if (this._form && this._form.data !== formData) {
        this._form.data = formData;
      }
    });
  }

  _syncFormData() {
    if (this._form && !this._updating && this._hass) {
      try {
        this._updating = true;
        this._form.hass = this._hass;
        // Normalizar configuração antes de sincronizar com o form
        const normalizedConfig = this._normalizeConfig(this._config || {});
        // Criar uma cópia profunda para evitar problemas de referência
        let formData;
        try {
          formData = JSON.parse(JSON.stringify(normalizedConfig));
        } catch (error) {
          formData = { ...normalizedConfig };
        }
        this._form.data = formData;
      } catch (error) {
        console.error("Erro ao sincronizar dados do form:", error, this._config);
      } finally {
        setTimeout(() => {
          this._updating = false;
        }, 50);
      }
    }
  }

  _buildSchema() {
    return [
      {
        name: "api_key",
        label: "Google Maps API Key",
        required: true,
        selector: { text: {} },
      },
      {
        name: "follow_entity",
        label: "Entidade para seguir (booleana, opcional)",
        selector: { entity: { domain: "input_boolean" } },
      },
      {
        name: "modo_noturno",
        label: "Entidade modo noturno (opcional)",
        selector: { entity: { domain: "input_boolean" } },
      },
      {
        name: "transito",
        label: "Entidade transito (opcional)",
        selector: { entity: { domain: "input_boolean" } },
      },
      {
        name: "transito_on",
        label: "Transito ligado (sem entidade)",
        selector: { boolean: {} },
      },
      {
        name: "mostrar_menu",
        label: "Mostrar menu superior (opcional)",
        selector: { boolean: {} },
      },
      {
        name: "mostrar_tipo_mapa",
        label: "Mostrar botões Mapa/Satélite (opcional)",
        selector: { boolean: {} },
      },
      {
        name: "mostrar_tela_cheia",
        label: "Mostrar botão tela cheia (opcional)",
        selector: { boolean: {} },
      },
      {
        name: "mostrar_controles_navegacao",
        label: "Mostrar controles de navegação (opcional)",
        selector: { boolean: {} },
      },
      {
        name: "ocultar_creditos",
        label: "Ocultar créditos/termos do mapa (opcional)",
        selector: { boolean: {} },
      },
      {
        name: "historico_somente_rastro",
        label: "Histórico: carregar só se rastro ativo",
        selector: { boolean: {} },
      },
      {
        name: "historico_carregar_no_start",
        label: "Histórico: carregar ao iniciar",
        selector: { boolean: {} },
      },
      {
        name: "historico_recarregar",
        label: "Histórico: recarregar ao alterar config",
        selector: { boolean: {} },
      },
      {
        name: "historico_limite_pontos",
        label: "Histórico: limite de pontos (opcional)",
        selector: { number: { min: 10, max: 10000, step: 10 } },
      },
      {
        name: "modo_noturno_on",
        label: "Modo noturno ligado (sem entidade)",
        selector: { boolean: {} },
      },
      {
        name: "seguir_on",
        label: "Seguir ligado (sem entidade)",
        selector: { boolean: {} },
      },
      {
        name: "rotacao_on",
        label: "Rotação ligada (sem menu)",
        selector: { boolean: {} },
      },
      {
        name: "tipo_mapa",
        label: "Tipo de mapa (opcional)",
        selector: {
          select: {
            options: [
              { label: "Mapa", value: "roadmap" },
              { label: "Satélite", value: "satellite" },
              { label: "Híbrido", value: "hybrid" },
              { label: "Terreno", value: "terrain" },
            ],
          },
        },
      },
      {
        name: "max_height",
        label: "Altura máxima do mapa em pixels (opcional)",
        selector: { number: { min: 100, max: 2000, step: 10, unit_of_measurement: "px" } },
      },
      {
        name: "max_width",
        label: "Largura máxima do mapa em pixels (opcional)",
        selector: { number: { min: 100, max: 2000, step: 10, unit_of_measurement: "px" } },
      },
      {
        name: "entities",
        label: "Entidades",
        selector: {
          object: {
            multiple: true,
            label_field: "entity",
            fields: {
              entity: {
                label: "Entidade",
                required: true,
                selector: { entity: {} },
              },
              name: {
                label: "Nome personalizado (opcional)",
                selector: { text: {} },
              },
              image: {
                label: "Imagem (opcional)",
                selector: { text: {} },
              },
              image_rotated: {
                label: "Imagem Rotacionada (opcional, beta)",
                selector: { text: {} },
              },
              rastro: {
                label: "Rastro (opcional)",
                selector: { boolean: {} },
              },
              rastro_duracao_min: {
                label: "Rastro: duração em minutos (opcional)",
                selector: { number: { min: 1, max: 1440, step: 1, unit_of_measurement: "min" } },
              },
              rastro_pontos_por_min: {
                label: "Rastro: pontos por minuto (opcional)",
                selector: { number: { min: 1, max: 120, step: 1 } },
              },
              rastro_max_pontos: {
                label: "Rastro: máximo de pontos (opcional)",
                selector: { number: { min: 10, max: 10000, step: 10 } },
              },
              rastro_cor: {
                label: "Rastro: cor (opcional)",
                selector: { color_rgb: {} },
              },
              velocidade: {
                label: "Sensor de velocidade (opcional)",
                selector: { entity: {} },
              },
              altitude: {
                label: "Sensor de altitude (opcional)",
                selector: { entity: {} },
              },
              condition: {
                label: "Condicao (opcional)",
                selector: { entity: { domain: "input_boolean" } },
              },
            },
          },
        },
      },
    ];
  }

  _normalizeConfig(config) {
    if (!config || typeof config !== "object") {
      return { 
        api_key: "",
        follow_entity: "",
        max_height: null,
        max_width: null,
        entities: []
      };
    }
    try {
      // Normalizar entidades
      const normalizedEntities = normalizeEntitiesConfig(config.entities || []);
      
      // Criar objeto normalizado preservando todos os campos
      const normalized = {
        api_key: config.api_key || "",
        follow_entity: config.follow_entity || "",
        modo_noturno: config.modo_noturno || "",
        transito: config.transito || "",
        mostrar_menu: config.mostrar_menu !== false,
        mostrar_tipo_mapa: config.mostrar_tipo_mapa !== false,
        tipo_mapa: config.tipo_mapa || "roadmap",
        mostrar_tela_cheia: config.mostrar_tela_cheia !== false,
        mostrar_controles_navegacao: config.mostrar_controles_navegacao !== false,
        ocultar_creditos: config.ocultar_creditos === true,
        transito_on: config.transito_on === true,
        modo_noturno_on: config.modo_noturno_on === true,
        seguir_on: config.seguir_on === true,
        rotacao_on: config.rotacao_on === true,
        historico_somente_rastro: config.historico_somente_rastro !== false,
        historico_carregar_no_start: config.historico_carregar_no_start !== false,
        historico_recarregar: config.historico_recarregar === true,
        historico_limite_pontos: Number.isFinite(config.historico_limite_pontos)
          ? config.historico_limite_pontos
          : null,
        max_height: config.max_height || null,
        max_width: config.max_width || null,
        entities: normalizedEntities,
      };
      
      // Preservar outros campos que possam existir
      Object.keys(config).forEach((key) => {
        if (!normalized.hasOwnProperty(key)) {
          normalized[key] = config[key];
        }
      });
      
      return normalized;
    } catch (error) {
      console.error("Erro ao normalizar configuração:", error, config);
      return {
        api_key: config.api_key || "",
        follow_entity: config.follow_entity || "",
        modo_noturno: config.modo_noturno || "",
        transito: config.transito || "",
        mostrar_menu: config.mostrar_menu !== false,
        mostrar_tipo_mapa: config.mostrar_tipo_mapa !== false,
        tipo_mapa: config.tipo_mapa || "roadmap",
        mostrar_tela_cheia: config.mostrar_tela_cheia !== false,
        mostrar_controles_navegacao: config.mostrar_controles_navegacao !== false,
        ocultar_creditos: config.ocultar_creditos === true,
        transito_on: config.transito_on === true,
        modo_noturno_on: config.modo_noturno_on === true,
        seguir_on: config.seguir_on === true,
        rotacao_on: config.rotacao_on === true,
        historico_somente_rastro: config.historico_somente_rastro !== false,
        historico_carregar_no_start: config.historico_carregar_no_start !== false,
        historico_recarregar: config.historico_recarregar === true,
        historico_limite_pontos: Number.isFinite(config.historico_limite_pontos)
          ? config.historico_limite_pontos
          : null,
        max_height: config.max_height || null,
        max_width: config.max_width || null,
        entities: Array.isArray(config.entities) ? config.entities : [],
      };
    }
  }

  _dispatchConfigChanged(config) {
    if (!config || typeof config !== "object") {
      return;
    }
    try {
      // Garantir que a configuração está normalizada antes de salvar
      const normalizedConfig = this._normalizeConfig(config);
      this._config = normalizedConfig;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: normalizedConfig },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error("Erro ao despachar mudança de configuração:", error);
      // Em caso de erro, ainda tenta salvar a configuração original
      this._config = config;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

export { GoogleMapsCarCardCaduEditor };
