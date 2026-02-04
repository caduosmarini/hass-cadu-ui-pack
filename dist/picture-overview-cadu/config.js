const ENTITY_FIELD_ORDER = ["entity", "name", "icon", "show_state", "show_condition", "position", "decimals", "background_color", "background_color_opacity", "border_width", "border_color", "text_color", "tap_action"];

function normalizeColor(colorValue) {
  if (!colorValue) {
    return "";
  }
  const toByte = (v) => Math.max(0, Math.min(255, Number(v) || 0));
  const toHex = (v) => toByte(v).toString(16).padStart(2, "0");
  const toAlpha = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    if (numeric > 1) {
      return Math.max(0, Math.min(1, numeric / 100));
    }
    return Math.max(0, Math.min(1, numeric));
  };

  if (Array.isArray(colorValue) && colorValue.length >= 3) {
    const [r, g, b] = colorValue;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  if (typeof colorValue === "object") {
    const alpha = toAlpha(colorValue.alpha ?? colorValue.opacity);
    let rgb = colorValue.color;
    if (!rgb && ["r", "g", "b"].every((key) => key in colorValue)) {
      rgb = { r: colorValue.r, g: colorValue.g, b: colorValue.b };
    }
    if (Array.isArray(rgb) && rgb.length >= 3) {
      const [r, g, b] = rgb;
      if (alpha === null) {
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
      return `rgba(${toByte(r)}, ${toByte(g)}, ${toByte(b)}, ${alpha})`;
    }
    if (rgb && typeof rgb === "object") {
      const { r, g, b } = rgb;
      if (alpha === null) {
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
      return `rgba(${toByte(r)}, ${toByte(g)}, ${toByte(b)}, ${alpha})`;
    }
  }

  if (typeof colorValue === "string" && colorValue.trim() !== "") {
    const str = colorValue.trim();
    // Hex 8 digitos (#RRGGBBAA) -> rgba para suportar transparência
    const hex8 = str.match(/^#([0-9a-fA-F]{8})$/);
    if (hex8) {
      const hex = hex8[1];
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    // Hex 6 ou 3 digitos: manter como está
    return str;
  }
  return "";
}

function normalizeEntityConfig(entityConfig) {
  if (!entityConfig || typeof entityConfig !== "object" || Array.isArray(entityConfig)) {
    return {
      entity: "",
      name: "",
      icon: "",
      show_state: false,
      show_condition: "",
      position: "bottom",
      decimals: 1,
      background_color: "",
      background_color_opacity: null,
      border_width: 0,
      border_color: "",
      text_color: "",
      tap_action: {},
    };
  }

  try {
    const numericKeys = Object.keys(entityConfig).filter((key) => /^\d+$/.test(key));
    const op = entityConfig.background_color_opacity;
    const bw = entityConfig.border_width;
    const normalized = {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      icon: entityConfig.icon || "",
      show_state: entityConfig.show_state === true,
      show_condition: typeof entityConfig.show_condition === "string" ? entityConfig.show_condition : "",
      position: entityConfig.position || "bottom",
      decimals: Number.isFinite(entityConfig.decimals) ? entityConfig.decimals : 1,
      background_color: normalizeColor(entityConfig.background_color),
      background_color_opacity: op !== undefined && op !== null && Number.isFinite(Number(op)) ? Math.max(0, Math.min(100, Number(op))) : null,
      border_width: bw !== undefined && bw !== null && Number.isFinite(Number(bw)) ? Math.max(0, Math.min(2, Number(bw))) : 0,
      border_color: normalizeColor(entityConfig.border_color),
      text_color: normalizeColor(entityConfig.text_color),
      tap_action: entityConfig.tap_action || {},
    };

    Object.keys(entityConfig).forEach((key) => {
      if (!/^\d+$/.test(key) && normalized[key] === undefined) {
        normalized[key] = entityConfig[key];
      }
    });

    if (numericKeys.length > 0) {
      numericKeys.forEach((key) => {
        const index = Number(key);
        if (isNaN(index) || index < 0 || index >= ENTITY_FIELD_ORDER.length) {
          return;
        }
        const fieldName = ENTITY_FIELD_ORDER[index];
        if (fieldName && normalized[fieldName] === "" && entityConfig[key]) {
          normalized[fieldName] = entityConfig[key];
        }
      });
    }

    return normalized;
  } catch (error) {
    console.error("Erro ao normalizar entidade:", error, entityConfig);
    const op = entityConfig.background_color_opacity;
    const bw = entityConfig.border_width;
    return {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      icon: entityConfig.icon || "",
      show_state: entityConfig.show_state === true,
      show_condition: typeof entityConfig.show_condition === "string" ? entityConfig.show_condition : "",
      position: entityConfig.position || "bottom",
      decimals: Number.isFinite(entityConfig.decimals) ? entityConfig.decimals : 1,
      background_color: normalizeColor(entityConfig.background_color),
      background_color_opacity: op !== undefined && op !== null && Number.isFinite(Number(op)) ? Math.max(0, Math.min(100, Number(op))) : null,
      border_width: bw !== undefined && bw !== null && Number.isFinite(Number(bw)) ? Math.max(0, Math.min(2, Number(bw))) : 0,
      border_color: normalizeColor(entityConfig.border_color),
      text_color: normalizeColor(entityConfig.text_color),
      tap_action: entityConfig.tap_action || {},
      ...entityConfig,
    };
  }
}

/** Aplica opacidade (0-100) a uma cor #hex ou rgba(); retorna rgba(). */
function colorWithOpacity(colorStr, opacityPercent) {
  if (!colorStr || typeof colorStr !== "string") return colorStr || "";
  const num = Number(opacityPercent);
  if (!Number.isFinite(num)) return colorStr;
  const alpha = Math.max(0, Math.min(1, num / 100));
  const toByte = (v) => Math.max(0, Math.min(255, Number(v) || 0));
  const hex6 = colorStr.match(/^#([0-9a-fA-F]{6})$/);
  if (hex6) {
    const h = hex6[1];
    return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha})`;
  }
  const hex8 = colorStr.match(/^#([0-9a-fA-F]{8})$/);
  if (hex8) {
    const h = hex8[1];
    return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha})`;
  }
  const rgba = colorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);
  if (rgba) {
    return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${alpha})`;
  }
  return colorStr;
}

function normalizeEntitiesConfig(entities) {
  if (Array.isArray(entities)) {
    return entities
      .filter((entityConfig) => entityConfig !== null && entityConfig !== undefined)
      .map((entityConfig) => {
        try {
          if (typeof entityConfig === "string") {
            return normalizeEntityConfig({ entity: entityConfig });
          }
          return normalizeEntityConfig(entityConfig);
        } catch (error) {
          console.error("Erro ao normalizar entidade:", error, entityConfig);
          return entityConfig;
        }
      });
  }

  if (entities && typeof entities === "object") {
    const keys = Object.keys(entities);
    const ordered = keys
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => entities[key]);
    if (ordered.length > 0) {
      return normalizeEntitiesConfig(ordered);
    }
  }

  return [];
}

function normalizeConfig(config) {
  if (!config || typeof config !== "object") {
    return {
      title: "",
      title_icon: "",
      title_secondary: "",
      subtitle: "",
      image: "",
      image_media_content_id: "",
      image_entity: "",
      aspect_ratio: "1.5",
      fit_mode: "cover",
      camera_view: "auto",
      tap_action: { action: "more-info" },
      entities: [],
    };
  }

  try {
    const normalizeTitleIcon = (value) => {
      if (typeof value === "string") {
        return value;
      }
      if (value && typeof value === "object") {
        return value.icon || value.value || "";
      }
      return "";
    };
    const normalizedEntities = normalizeEntitiesConfig(config.entities || []);
    let imageMediaContentId = "";
    if (config.image && typeof config.image === "object") {
      imageMediaContentId = config.image.media_content_id || "";
    }
    if (config.image_media_content_id) {
      imageMediaContentId = config.image_media_content_id;
    }
    const normalizedImage = imageMediaContentId
      ? { media_content_id: imageMediaContentId }
      : typeof config.image === "string"
        ? config.image
        : "";
    const normalized = {
      title: config.title || "",
      title_icon: normalizeTitleIcon(config.title_icon),
      title_secondary: config.title_secondary || "",
      subtitle: config.subtitle || "",
      image: normalizedImage,
      image_media_content_id: imageMediaContentId,
      image_entity: config.image_entity || "",
      aspect_ratio: config.aspect_ratio || "1.5",
      fit_mode: config.fit_mode || "cover",
      camera_view: config.camera_view || "auto",
      tap_action: config.tap_action || { action: "more-info" },
      entities: normalizedEntities,
    };

    Object.keys(config).forEach((key) => {
      if (!normalized.hasOwnProperty(key)) {
        normalized[key] = config[key];
      }
    });

    return normalized;
  } catch (error) {
    console.error("Erro ao normalizar configuração:", error, config);
    const normalizeTitleIcon = (value) => {
      if (typeof value === "string") {
        return value;
      }
      if (value && typeof value === "object") {
        return value.icon || value.value || "";
      }
      return "";
    };
    let imageMediaContentId = "";
    if (config.image && typeof config.image === "object") {
      imageMediaContentId = config.image.media_content_id || "";
    }
    if (config.image_media_content_id) {
      imageMediaContentId = config.image_media_content_id;
    }
    const normalizedImage = imageMediaContentId
      ? { media_content_id: imageMediaContentId }
      : typeof config.image === "string"
        ? config.image
        : "";
    return {
      title: config.title || "",
      title_icon: normalizeTitleIcon(config.title_icon),
      title_secondary: config.title_secondary || "",
      subtitle: config.subtitle || "",
      image: normalizedImage,
      image_media_content_id: imageMediaContentId,
      image_entity: config.image_entity || "",
      aspect_ratio: config.aspect_ratio || "1.5",
      fit_mode: config.fit_mode || "cover",
      camera_view: config.camera_view || "auto",
      tap_action: config.tap_action || { action: "more-info" },
      entities: Array.isArray(config.entities) ? config.entities : [],
    };
  }
}

export { ENTITY_FIELD_ORDER, colorWithOpacity, normalizeColor, normalizeConfig, normalizeEntitiesConfig };
