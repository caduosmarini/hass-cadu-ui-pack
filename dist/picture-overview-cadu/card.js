import { normalizeConfig } from "./config.js";

class PictureOverviewCadu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._styleElement = document.createElement("style");
    this.shadowRoot.appendChild(this._styleElement);
  }

  setConfig(config) {
    this._config = normalizeConfig(config || {});
    // Apenas renderiza se o hass ja estiver disponivel ou for a primeira vez
    if (this._hass) {
        this._render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    // Renderiza apenas se tiver config e ainda nao renderizou ou se precisar atualizar dados dinamicos
    if (this._config) {
      this._render();
    }
  }

  getCardSize() {
    return 3;
  }

  _render() {
    if (!this.shadowRoot) return;

    const aspectRatio = this._parseAspectRatio(this._config?.aspect_ratio);
    const fitMode = this._config?.fit_mode || "cover";

    this._styleElement.textContent = `
      :host {
        display: block;
      }
      ha-card {
        border-radius: 10px;
        overflow: hidden;
      }
      .picture-wrapper {
        position: relative;
        width: 100%;
        cursor: pointer;
        border-radius: inherit;
        overflow: hidden;
      }
      .picture-spacer {
        display: block;
        padding-top: calc(100% / var(--po-aspect-ratio));
      }
      .picture-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: var(--po-fit-mode);
      }
      .overlay {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 10px 12px;
        gap: 12px;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 0 0 6px 6px;
        pointer-events: none;
      }
      .overlay-top {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
        padding: 8px 12px;
        pointer-events: none;
      }
      .overlay-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      }
      .overlay-title ha-icon {
        --mdc-icon-size: 18px;
      }
      .overlay-entities {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
      }
      .overlay-entity {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.25);
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
        pointer-events: auto;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
      }
      .overlay-entity:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.02);
      }
      .overlay-entity:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }
      .picture-wrapper .overlay {
        transition: background 0.2s ease-in-out;
      }
      .picture-wrapper:hover .overlay {
        background: rgba(0, 0, 0, 0.5);
      }
      .overlay-entity ha-icon {
        --mdc-icon-size: 18px;
      }
      .picture-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        font-size: 14px;
      }
    `;

    const card = document.createElement("ha-card");

    const pictureWrapper = document.createElement("div");
    pictureWrapper.className = "picture-wrapper";
    pictureWrapper.style.setProperty("--po-aspect-ratio", String(aspectRatio));
    pictureWrapper.style.setProperty("--po-fit-mode", fitMode);
    pictureWrapper.addEventListener("click", () => {
      this._handleAction(this._config?.tap_action, this._getPrimaryEntityId());
    });

    const spacer = document.createElement("div");
    spacer.className = "picture-spacer";
    pictureWrapper.appendChild(spacer);

    const imageUrl = this._getImageUrl();
    if (imageUrl) {
      const img = document.createElement("img");
      img.className = "picture-image";
      img.src = imageUrl;
      img.alt = this._config?.title || "Imagem";
      pictureWrapper.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "picture-placeholder";
      placeholder.textContent = "Configure image ou image_entity";
      pictureWrapper.appendChild(placeholder);
    }

    const titleText = this._config?.title || "";
    const titleIcon = this._config?.title_icon || "";
    const overlayEntities = this._getOverlayEntityConfigs();
    const bottomEntities = overlayEntities.filter(
      (entityConfig) => (entityConfig.position || "bottom") === "bottom"
    );
    const topEntities = overlayEntities.filter(
      (entityConfig) => (entityConfig.position || "bottom") === "top"
    );

    if (topEntities.length > 0) {
      const overlayTop = document.createElement("div");
      overlayTop.className = "overlay-top";
      topEntities.forEach((entityConfig) => {
        const overlayEntity = document.createElement("div");
        overlayEntity.className = "overlay-entity";
        overlayEntity.addEventListener("click", (event) => {
          event.stopPropagation();
          const action = entityConfig.tap_action || this._config?.tap_action;
          this._handleAction(action, entityConfig.entity);
        });

        const icon = document.createElement("ha-icon");
        icon.icon = this._getEntityIcon(entityConfig);
        overlayEntity.appendChild(icon);

        const state = document.createElement("div");
        state.textContent = this._getEntityState(entityConfig.entity, entityConfig);
        overlayEntity.appendChild(state);

        overlayTop.appendChild(overlayEntity);
      });
      pictureWrapper.appendChild(overlayTop);
    }

    if (titleText || bottomEntities.length > 0) {
      const overlay = document.createElement("div");
      overlay.className = "overlay";

      if (titleText) {
        const overlayTitle = document.createElement("div");
        overlayTitle.className = "overlay-title";
        if (titleIcon) {
          const icon = document.createElement("ha-icon");
          icon.icon = titleIcon;
          overlayTitle.appendChild(icon);
        }
        const titleSpan = document.createElement("span");
        titleSpan.textContent = titleText;
        overlayTitle.appendChild(titleSpan);
        overlay.appendChild(overlayTitle);
      } else {
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        overlay.appendChild(spacer);
      }

      if (bottomEntities.length > 0) {
        const overlayEntitiesWrap = document.createElement("div");
        overlayEntitiesWrap.className = "overlay-entities";
        bottomEntities.forEach((entityConfig) => {
          const overlayEntity = document.createElement("div");
          overlayEntity.className = "overlay-entity";
          overlayEntity.addEventListener("click", (event) => {
            event.stopPropagation();
            const action = entityConfig.tap_action || this._config?.tap_action;
            this._handleAction(action, entityConfig.entity);
          });

          const icon = document.createElement("ha-icon");
          icon.icon = this._getEntityIcon(entityConfig);
          overlayEntity.appendChild(icon);

          const state = document.createElement("div");
          state.textContent = this._getEntityState(entityConfig.entity, entityConfig);
          overlayEntity.appendChild(state);

          overlayEntitiesWrap.appendChild(overlayEntity);
        });
        overlay.appendChild(overlayEntitiesWrap);
      }

      pictureWrapper.appendChild(overlay);
    }
    card.appendChild(pictureWrapper);

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(this._styleElement);
    this.shadowRoot.appendChild(card);
  }

  _parseAspectRatio(value) {
    if (!value || typeof value !== "string") {
      return 1.5;
    }
    const trimmed = value.trim();
    if (trimmed.includes(":")) {
      const [w, h] = trimmed.split(":").map((part) => Number(part));
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        return w / h;
      }
    }
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
    return 1.5;
  }

  _getImageUrl() {
    if (this._config?.image) {
      if (typeof this._config.image === "string") {
        return this._config.image;
      }
      if (typeof this._config.image === "object") {
        return this._config.image.media_content_id || "";
      }
    }
    const imageEntity = this._config?.image_entity;
    if (!imageEntity || !this._hass) {
      return "";
    }
    const state = this._hass.states?.[imageEntity];
    if (!state) {
      return "";
    }
    if (this._config?.camera_view === "live" && imageEntity.startsWith("camera.")) {
      const hassUrl = typeof this._hass.hassUrl === "function" ? this._hass.hassUrl : null;
      const streamPath = `/api/camera_proxy_stream/${imageEntity}`;
      return hassUrl ? hassUrl(streamPath) : streamPath;
    }
    return (
      state.attributes?.entity_picture ||
      state.attributes?.image ||
      (typeof state.state === "string" ? state.state : "")
    );
  }

  _getPrimaryEntityId() {
    const entities = Array.isArray(this._config?.entities) ? this._config.entities : [];
    return entities.length > 0 ? entities[0].entity : null;
  }

  _getOverlayEntityConfigs() {
    const entities = Array.isArray(this._config?.entities) ? this._config.entities : [];
    if (entities.length === 0) {
      return [];
    }
    const withState = entities.filter((entityConfig) => entityConfig?.show_state === true);
    if (withState.length > 0) {
      return withState;
    }
    return [entities[0]];
  }

  _getEntityName(entityConfig) {
    if (entityConfig?.name) {
      return entityConfig.name;
    }
    const state = this._hass?.states?.[entityConfig.entity];
    return state?.attributes?.friendly_name || entityConfig.entity;
  }

  _getEntityIcon(entityConfig) {
    if (entityConfig?.icon) {
      return entityConfig.icon;
    }
    const state = this._hass?.states?.[entityConfig.entity];
    return state?.attributes?.icon || "mdi:checkbox-blank-circle-outline";
  }

  _getEntityState(entityId, entityConfig = null) {
    const state = this._hass?.states?.[entityId];
    if (!state) {
      return "unavailable";
    }
    const unit = state.attributes?.unit_of_measurement;
    const decimals = Number.isFinite(entityConfig?.decimals) ? entityConfig.decimals : 1;
    const rawValue = typeof state.state === "string" ? state.state.replace(",", ".") : state.state;
    const numeric = Number.parseFloat(rawValue);
    if (Number.isFinite(numeric)) {
      const formatted = numeric.toFixed(decimals);
      return unit ? `${formatted} ${unit}` : formatted;
    }
    return unit ? `${state.state} ${unit}` : state.state;
  }

  _handleAction(actionConfig, entityId) {
    if (!actionConfig || actionConfig.action === "none") {
      return;
    }
    const action = actionConfig.action || "more-info";
    if (action === "more-info") {
      const targetEntity = actionConfig.entity || entityId;
      if (targetEntity) {
        this._fireEvent("hass-more-info", { entityId: targetEntity });
      }
      return;
    }
    if (action === "navigate" && actionConfig.navigation_path) {
      history.pushState(null, "", actionConfig.navigation_path);
      window.dispatchEvent(new Event("location-changed"));
      return;
    }
    if (action === "url" && actionConfig.url_path) {
      window.location.href = actionConfig.url_path;
      return;
    }
    if (action === "toggle" && entityId && this._hass) {
      this._hass.callService("homeassistant", "toggle", { entity_id: entityId });
      return;
    }
    if (action === "call-service" && actionConfig.service && this._hass) {
      const [domain, service] = actionConfig.service.split(".");
      if (domain && service) {
        this._hass.callService(domain, service, actionConfig.service_data || {});
      }
    }
  }

  _fireEvent(type, detail) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

export { PictureOverviewCadu };
