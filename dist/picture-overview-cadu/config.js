const ENTITY_FIELD_ORDER = ["entity", "name", "icon", "show_state", "tap_action"];

function normalizeEntityConfig(entityConfig) {
  if (!entityConfig || typeof entityConfig !== "object" || Array.isArray(entityConfig)) {
    return {
      entity: "",
      name: "",
      icon: "",
      show_state: false,
      tap_action: {},
    };
  }

  try {
    const numericKeys = Object.keys(entityConfig).filter((key) => /^\d+$/.test(key));
    const normalized = {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      icon: entityConfig.icon || "",
      show_state: entityConfig.show_state === true,
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
    return {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      icon: entityConfig.icon || "",
      show_state: entityConfig.show_state === true,
      tap_action: entityConfig.tap_action || {},
      ...entityConfig,
    };
  }
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

export { ENTITY_FIELD_ORDER, normalizeConfig, normalizeEntitiesConfig };
