const ENTITY_FIELD_ORDER = [
  "entity",
  "name",
  "image",
  "velocidade",
  "altitude",
  "condition",
];

function normalizeEntityConfig(entityConfig) {
  if (!entityConfig || typeof entityConfig !== "object" || Array.isArray(entityConfig)) {
    return {
      entity: "",
      name: "",
      image: "",
      image_rotated: "",
      velocidade: "",
      altitude: "",
      condition: "",
      rastro: false,
      rastro_duracao_min: null,
      rastro_pontos_por_min: null,
      rastro_cor: "",
      rastro_max_pontos: null,
    };
  }
  
  try {
    const numericKeys = Object.keys(entityConfig).filter((key) => /^\d+$/.test(key));
    
    // Criar novo objeto normalizado, preservando campos nomeados existentes
    const normalized = {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      image: entityConfig.image || "",
      image_rotated: entityConfig.image_rotated || "",
      velocidade: entityConfig.velocidade || "",
      altitude: entityConfig.altitude || "",
      condition: entityConfig.condition || "",
      rastro: entityConfig.rastro === true,
      rastro_duracao_min:
        typeof entityConfig.rastro_duracao_min === "number"
          ? entityConfig.rastro_duracao_min
          : null,
      rastro_pontos_por_min:
        typeof entityConfig.rastro_pontos_por_min === "number"
          ? entityConfig.rastro_pontos_por_min
          : null,
      rastro_cor: entityConfig.rastro_cor || "",
      rastro_max_pontos:
        typeof entityConfig.rastro_max_pontos === "number"
          ? entityConfig.rastro_max_pontos
          : null,
    };
    
    // Preservar outros campos que possam existir
    Object.keys(entityConfig).forEach((key) => {
      if (!/^\d+$/.test(key) && normalized[key] === undefined) {
        normalized[key] = entityConfig[key];
      }
    });
    
    // Converter chaves numéricas para campos nomeados
    if (numericKeys.length > 0) {
      numericKeys.forEach((key) => {
        const index = Number(key);
        if (isNaN(index) || index < 0 || index >= ENTITY_FIELD_ORDER.length) {
          return;
        }
        const fieldName = ENTITY_FIELD_ORDER[index];
        if (fieldName) {
          // Só sobrescreve se o campo nomeado estiver vazio
          if (normalized[fieldName] === "" && entityConfig[key]) {
            normalized[fieldName] = entityConfig[key];
          }
        }
      });
    }
    
    return normalized;
  } catch (error) {
    console.error("Erro ao normalizar entidade:", error, entityConfig);
    return {
      entity: entityConfig.entity || "",
      name: entityConfig.name || "",
      image: entityConfig.image || "",
      image_rotated: entityConfig.image_rotated || "",
      velocidade: entityConfig.velocidade || "",
      altitude: entityConfig.altitude || "",
      condition: entityConfig.condition || "",
      rastro: entityConfig.rastro === true,
      rastro_duracao_min:
        typeof entityConfig.rastro_duracao_min === "number"
          ? entityConfig.rastro_duracao_min
          : null,
      rastro_pontos_por_min:
        typeof entityConfig.rastro_pontos_por_min === "number"
          ? entityConfig.rastro_pontos_por_min
          : null,
      rastro_cor: entityConfig.rastro_cor || "",
      rastro_max_pontos:
        typeof entityConfig.rastro_max_pontos === "number"
          ? entityConfig.rastro_max_pontos
          : null,
      ...entityConfig
    };
  }
}

function normalizeEntitiesConfig(entities) {
  if (!Array.isArray(entities)) {
    return [];
  }
  return entities
    .filter((entityConfig) => entityConfig && typeof entityConfig === "object")
    .map((entityConfig) => {
      try {
        return normalizeEntityConfig(entityConfig);
      } catch (error) {
        console.error("Erro ao normalizar entidade:", error, entityConfig);
        return entityConfig;
      }
    });
}

export { ENTITY_FIELD_ORDER, normalizeEntityConfig, normalizeEntitiesConfig };
