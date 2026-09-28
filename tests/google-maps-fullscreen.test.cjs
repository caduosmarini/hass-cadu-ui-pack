const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../dist/google-maps-car-card-cadu/card.js"), "utf8")
  .replace(/^import .*;\r?\n/m, "")
  .replace(/export \{ GoogleMapsCarCardCadu \};/, "globalThis.Card = GoogleMapsCarCardCadu;");
const context = { HTMLElement: class {} };
vm.runInNewContext(source, context);

class Node {
  constructor(name) { this.name = name; this.children = []; this.parent = null; }
  appendChild(child) {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
    this.children.push(child);
    child.parent = this;
  }
  insertBefore(child, reference) {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
    const index = this.children.indexOf(reference);
    assert.notEqual(index, -1, "reference belongs to parent");
    this.children.splice(index, 0, child);
    child.parent = this;
  }
}

const card = Object.create(context.Card.prototype);
card.shadowRoot = new Node("root");
card.controlsContainer = new Node("controls");
card.mapShell = new Node("map");
card.followCountdownElement = new Node("resume");
card.fullscreenDialog = new Node("dialog");
card.fullscreenDialog.open = false;
card.fullscreenDialog.showModal = () => { card.fullscreenDialog.open = true; };
card.fullscreenDialog.close = () => {
  card.fullscreenDialog.open = false;
  card._closeFullscreen();
};
card._resizeMap = () => {};
card._updateFullscreenButton = () => {};
for (const child of [card.controlsContainer, card.mapShell, card.fullscreenDialog,
  card.followCountdownElement]) card.shadowRoot.appendChild(child);

card._toggleFullscreen();
assert.deepEqual(card.fullscreenDialog.children.map((child) => child.name),
  ["controls", "map", "resume"], "fullscreen contains card options and resume control");
card._toggleFullscreen();
assert.deepEqual(card.shadowRoot.children.map((child) => child.name),
  ["controls", "map", "dialog", "resume"], "closing restores the original card layout");

console.log("Google Maps fullscreen tests passed");
