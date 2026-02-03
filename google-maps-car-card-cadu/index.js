import { GoogleMapsCarCardCadu } from "./card.js";
import { GoogleMapsCarCardCaduEditor } from "./editor.js";

if (!customElements.get("google-maps-car-card-cadu")) {
  customElements.define("google-maps-car-card-cadu", GoogleMapsCarCardCadu);
}

if (!customElements.get("google-maps-car-card-cadu-editor")) {
  customElements.define("google-maps-car-card-cadu-editor", GoogleMapsCarCardCaduEditor);
}

GoogleMapsCarCardCadu.getConfigElement = function () {
  return document.createElement("google-maps-car-card-cadu-editor");
};

GoogleMapsCarCardCadu.getStubConfig = function () {
  return {
    api_key: "",
    follow_entity: "",
    entities: [],
  };
};

window.customCards = window.customCards || [];
window.customCards.push({
  type: "google-maps-car-card-cadu",
  name: "Google Maps Car Card Cadu",
  description: "Exibe dispositivos no Google Maps com InfoBox personalizado.",
});
