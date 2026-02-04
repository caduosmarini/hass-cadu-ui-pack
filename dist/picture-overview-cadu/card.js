import { normalizeConfig } from "./config.js";

class PictureOverviewCadu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._styleElement = document.createElement("style");
    this.shadowRoot.appendChild(this._styleElement);
    this._rendered = false;
    this._templateCache = new Map();
    this._templateRequests = new Map();
  }

  setConfig(config) {
    this._config = normalizeConfig(config || {});
    if (this._rendered) {
      this._updateCard();
    } else if (this._hass) {
      this._initialRender();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this._rendered) {
      this._updateCard();
    } else if (this._config) {
      this._initialRender();
    }
  }

  getCardSize() {
    return 3;
  }

  _initialRender() {
    if (!this.shadowRoot || !this._hass || !this._config) return;
    if (this._rendered) return;

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
        transition: background 0.2s ease-in-out;
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
      .overlay-title-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
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
      .overlay-title-secondary {
        color: rgba(255, 255, 255, 0.9);
        font-size: 13px;
        font-weight: 400;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        margin-left: 4px;
      }
      .overlay-subtitle {
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
        font-weight: 400;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
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
      .picture-wrapper:hover .overlay {
        background: rgba(0, 0, 0, 0.5);
      }
      .overlay-entity ha-icon,
      .overlay-entity ha-state-icon {
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

    const img = document.createElement("img");
    img.className = "picture-image";
    img.alt = this._config?.title || "Imagem";
    pictureWrapper.appendChild(img);

    const placeholder = document.createElement("div");
    placeholder.className = "picture-placeholder";
    placeholder.textContent = "Configure image ou image_entity";
    placeholder.style.display = "none";
    pictureWrapper.appendChild(placeholder);

    // Container para overlays top
    const overlayTop = document.createElement("div");
    overlayTop.className = "overlay-top";
    pictureWrapper.appendChild(overlayTop);

    // Container para overlay bottom
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    pictureWrapper.appendChild(overlay);

    card.appendChild(pictureWrapper);
    this.shadowRoot.appendChild(card);

    // Salvar referencias para updates
    this._elements = {
      card,
      pictureWrapper,
      img,
      placeholder,
      overlayTop,
      overlay,
    };

    this._rendered = true;
    this._updateCard();
  }

  _updateCard() {
    if (!this._rendered || !this._elements) return;

    const { img, placeholder, overlayTop, overlay } = this._elements;

    // Update image
    const imageUrl = this._getImageUrl();
    if (imageUrl) {
      img.src = imageUrl;
      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }

    // Update top overlay entities
    this._updateOverlayTop(overlayTop);

    // Update bottom overlay (title + entities)
    this._updateOverlayBottom(overlay);
  }

  _updateOverlayTop(overlayTop) {
    const overlayEntities = this._getOverlayEntityConfigs();
    const topEntities = overlayEntities.filter(
      (entityConfig) => (entityConfig.position || "bottom") === "top"
    );

    overlayTop.innerHTML = "";
    if (topEntities.length === 0) return;

    topEntities.forEach((entityConfig) => {
      const overlayEntity = document.createElement("div");
      overlayEntity.className = "overlay-entity";
      
      // Aplicar cores customizadas
      const bgColor = entityConfig.background_color || "rgba(255, 255, 255, 0.25)";
      const textColor = entityConfig.text_color || "#fff";
      overlayEntity.style.background = bgColor;
      overlayEntity.style.color = textColor;
      
      overlayEntity.addEventListener("click", (event) => {
        event.stopPropagation();
        const action = entityConfig.tap_action || this._config?.tap_action;
        this._handleAction(action, entityConfig.entity);
      });

      const icon = this._createEntityIcon(entityConfig);
      overlayEntity.appendChild(icon);

      const state = document.createElement("div");
      state.textContent = this._getEntityState(entityConfig.entity, entityConfig);
      overlayEntity.appendChild(state);

      overlayTop.appendChild(overlayEntity);
    });
  }

  _updateOverlayBottom(overlay) {
    const titleText = this._config?.title || "";
    const titleSecondary = this._config?.title_secondary || "";
    const subtitle = this._renderTemplate(this._config?.subtitle || "");
    const titleIcon = this._config?.title_icon || "";
    const overlayEntities = this._getOverlayEntityConfigs();
    const bottomEntities = overlayEntities.filter(
      (entityConfig) => (entityConfig.position || "bottom") === "bottom"
    );

    overlay.innerHTML = "";
    overlay.style.display = (titleText || subtitle || bottomEntities.length > 0) ? "flex" : "none";

    if (titleText || subtitle) {
      const titleContainer = document.createElement("div");
      titleContainer.className = "overlay-title-container";
      
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
        
        // Adiciona título secundário ao lado do principal
        if (titleSecondary) {
          const titleSecondarySpan = document.createElement("span");
          titleSecondarySpan.className = "overlay-title-secondary";
          titleSecondarySpan.textContent = titleSecondary;
          overlayTitle.appendChild(titleSecondarySpan);
        }
        
        titleContainer.appendChild(overlayTitle);
      }

      if (subtitle) {
        const subtitleDiv = document.createElement("div");
        subtitleDiv.className = "overlay-subtitle";
        subtitleDiv.textContent = subtitle;
        // Alinha o subtitulo com o texto do titulo (pula o icone)
        if (titleIcon) {
          subtitleDiv.style.paddingLeft = "24px"; // 18px icon + 6px gap
        } else {
          subtitleDiv.style.paddingLeft = "0";
        }
        titleContainer.appendChild(subtitleDiv);
      }

      overlay.appendChild(titleContainer);
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
        
        // Aplicar cores customizadas
        const bgColor = entityConfig.background_color || "rgba(255, 255, 255, 0.25)";
        const textColor = entityConfig.text_color || "#fff";
        overlayEntity.style.background = bgColor;
        overlayEntity.style.color = textColor;
        
        overlayEntity.addEventListener("click", (event) => {
          event.stopPropagation();
          const action = entityConfig.tap_action || this._config?.tap_action;
          this._handleAction(action, entityConfig.entity);
        });

        const icon = this._createEntityIcon(entityConfig);
        overlayEntity.appendChild(icon);

        const state = document.createElement("div");
        state.textContent = this._getEntityState(entityConfig.entity, entityConfig);
        overlayEntity.appendChild(state);

        overlayEntitiesWrap.appendChild(overlayEntity);
      });
      overlay.appendChild(overlayEntitiesWrap);
    }
  }

  _renderTemplate(template) {
    if (!template || typeof template !== "string") {
      return "";
    }
    // Verificar se é um template jinja
    if (!template.includes("{%") && !template.includes("{{")) {
      return template;
    }
    // Renderizar template via HA
    try {
      if (!this._hass || !this._hass.connection) {
        return "";
      }
      const now = Date.now();
      const cached = this._templateCache.get(template);
      
      // Se tem cache válido (menos de 1 segundo), retorna
      if (cached && now - cached.ts < 1000) {
        return cached.value;
      }
      
      // Se não tem request em andamento, dispara um novo
      if (!this._templateRequests.has(template)) {
        const unsubscribe = this._hass.connection.subscribeMessage(
          (msg) => {
            const result = msg?.result || "";
            this._templateCache.set(template, {
              value: String(result),
              ts: Date.now(),
            });
            this._templateRequests.delete(template);
            // Desinscreve após receber o primeiro resultado
            if (unsubscribe) {
              unsubscribe();
            }
            // Atualiza o card quando o template resolver
            requestAnimationFrame(() => this._updateCard());
          },
          { type: "render_template", template }
        );
        this._templateRequests.set(template, unsubscribe);
      }
      
      // Retorna cache existente (mesmo que expirado) ou vazio enquanto aguarda
      return cached ? cached.value : "";
    } catch (error) {
      console.warn("Erro ao renderizar template:", error);
      return "";
    }
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
    return entities.length > 0 ? [entities[0]] : [];
  }

  _getEntityName(entityConfig) {
    if (entityConfig?.name) {
      return entityConfig.name;
    }
    const state = this._hass?.states?.[entityConfig.entity];
    return state?.attributes?.friendly_name || entityConfig.entity;
  }

  _createEntityIcon(entityConfig) {
    const iconOverride = entityConfig?.icon;
    const state = this._hass?.states?.[entityConfig.entity];
    if (state) {
      const icon = document.createElement("ha-state-icon");
      icon.hass = this._hass;
      icon.stateObj = state;
      if (iconOverride && iconOverride !== "") {
        icon.icon = iconOverride;
      } else {
        const resolved = this._getEntityIconFromState(state);
        if (resolved) {
          icon.icon = resolved;
        }
      }
      return icon;
    }
    const icon = document.createElement("ha-icon");
    icon.icon =
      iconOverride && iconOverride !== ""
        ? iconOverride
        : "mdi:checkbox-blank-circle-outline";
    return icon;
  }

  _getEntityIconFromState(state) {
    if (!state) {
      return "";
    }
    const attrIcon = state.attributes?.icon;
    if (attrIcon) {
      return attrIcon;
    }
    const deviceClass = state.attributes?.device_class;
    if (deviceClass === "temperature") {
      return "mdi:thermometer";
    }
    return "";
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
