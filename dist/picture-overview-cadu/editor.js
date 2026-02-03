import { normalizeConfig } from "./config.js";

class PictureOverviewCaduEditor extends HTMLElement {
  constructor() {
    super();
    this._updating = false;
  }

  setConfig(config) {
    this._config = normalizeConfig(config || {});
    if (this._rendered && this._hass) {
      this._syncFormData();
    } else if (!this._rendered && this._hass) {
      this._render();
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
      return;
    }
    this._rendered = true;
    this.innerHTML = "";

    const form = document.createElement("ha-form");
    form.hass = this._hass;

    const normalizedConfig = normalizeConfig(this._config || {});
    let formData;
    try {
      formData = JSON.parse(JSON.stringify(normalizedConfig));
    } catch (error) {
      formData = { ...normalizedConfig };
    }

    formData = this._ensureEntitiesArray(formData);
    form.schema = this._buildSchema();
    form.computeLabel = (schema) => schema.label || schema.name;
    form.data = formData;

    form.addEventListener("value-changed", (event) => {
      if (!this._updating) {
        this._updating = true;
        this._dispatchConfigChanged(event.detail.value);
        setTimeout(() => {
          this._updating = false;
        }, 100);
      }
    });

    this.appendChild(form);
    this._form = form;
  }

  _syncFormData() {
    if (!this._form || this._updating || !this._hass) {
      return;
    }
    try {
      this._updating = true;
      this._form.hass = this._hass;
      const normalizedConfig = normalizeConfig(this._config || {});
      let formData;
      try {
        formData = JSON.parse(JSON.stringify(normalizedConfig));
      } catch (error) {
        formData = { ...normalizedConfig };
      }
      formData = this._ensureEntitiesArray(formData);
      this._form.data = formData;
    } finally {
      setTimeout(() => {
        this._updating = false;
      }, 50);
    }
  }

  _ensureEntitiesArray(formData) {
    if (!formData || typeof formData !== "object") {
      return formData;
    }
    if (Array.isArray(formData.entities)) {
      return formData;
    }
    if (formData.entities && typeof formData.entities === "object") {
      const ordered = Object.keys(formData.entities)
        .filter((key) => /^\d+$/.test(key))
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => formData.entities[key]);
      return { ...formData, entities: ordered };
    }
    return { ...formData, entities: [] };
  }

  _buildSchema() {
    return [
      {
        name: "title",
        label: "Titulo",
        selector: { text: {} },
      },
      {
        name: "title_icon",
        label: "Icone do titulo (opcional)",
        selector: { icon: {} },
      },
      {
        name: "image",
        label: "Imagem (url/local)",
        selector: { text: {} },
      },
      {
        name: "image_media_content_id",
        label: "Imagem (media_content_id)",
        selector: { text: {} },
      },
      {
        name: "image_entity",
        label: "Entidade de imagem (opcional)",
        selector: { entity: {} },
      },
      {
        name: "aspect_ratio",
        label: "Aspect ratio (ex: 1.5 ou 16:9)",
        selector: { text: {} },
      },
      {
        name: "fit_mode",
        label: "Fit mode",
        selector: {
          select: {
            options: [
              { label: "Cover", value: "cover" },
              { label: "Contain", value: "contain" },
            ],
          },
        },
      },
      {
        name: "camera_view",
        label: "Camera view",
        selector: {
          select: {
            options: [
              { label: "Auto", value: "auto" },
              { label: "Live", value: "live" },
            ],
          },
        },
      },
      {
        name: "tap_action",
        label: "Tap action",
        selector: { action: {} },
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
                label: "Nome (opcional)",
                selector: { text: {} },
              },
              icon: {
                label: "Icone (opcional)",
                selector: { icon: {} },
              },
              show_state: {
                label: "Mostrar estado",
                selector: { boolean: {} },
              },
              position: {
                label: "Posicao do overlay",
                selector: {
                  select: {
                    options: [
                      { label: "Inferior", value: "bottom" },
                      { label: "Superior direita", value: "top" },
                    ],
                  },
                },
              },
              decimals: {
                label: "Casas decimais (padrao 1)",
                selector: { number: { min: 0, max: 4, step: 1 } },
              },
              tap_action: {
                label: "Tap action (opcional)",
                selector: { action: {} },
              },
            },
          },
        },
      },
    ];
  }

  _dispatchConfigChanged(config) {
    if (!config || typeof config !== "object") {
      return;
    }
    const normalized = normalizeConfig(config);
    this._config = normalized;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: normalized },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export { PictureOverviewCaduEditor };
