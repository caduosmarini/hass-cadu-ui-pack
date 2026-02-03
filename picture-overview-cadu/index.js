import { PictureOverviewCadu } from "./card.js";
import { PictureOverviewCaduEditor } from "./editor.js";

if (!customElements.get("picture-overview-cadu")) {
  customElements.define("picture-overview-cadu", PictureOverviewCadu);
}

if (!customElements.get("picture-overview-cadu-editor")) {
  customElements.define("picture-overview-cadu-editor", PictureOverviewCaduEditor);
}

PictureOverviewCadu.getConfigElement = function () {
  return document.createElement("picture-overview-cadu-editor");
};

PictureOverviewCadu.getStubConfig = function () {
  return {
    title: "Picture Overview",
    aspect_ratio: "1.5",
    fit_mode: "cover",
    entities: [],
  };
};

window.customCards = window.customCards || [];
window.customCards.push({
  type: "picture-overview-cadu",
  name: "Picture Overview Cadu",
  description: "Imagem com entities e tap_action estilo picture-glance.",
});
