const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../dist/google-maps-car-card-cadu/card.js"), "utf8")
  .replace(/^import .*;\r?\n/m, "")
  .replace(/export \{ GoogleMapsCarCardCadu \};/, "globalThis.Card = GoogleMapsCarCardCadu;");
const context = {
  HTMLElement: class {},
  google: { maps: { Marker: class Marker {}, LatLng: class LatLng {
    constructor(lat, lng) { this._lat = lat; this._lng = lng; }
    lat() { return this._lat; }
    lng() { return this._lng; }
  } } },
  requestAnimationFrame: () => 1,
};
vm.runInNewContext(source, context);

const card = Object.create(context.Card.prototype);
card._config = { prever_movimento: true };
card._hass = { states: { speed: { state: "72", last_updated: new Date().toISOString(), attributes: { unit_of_measurement: "km/h" } } } };
card._motion = {};
card._motionFrame = null;
card._uiState = { motionOverride: false, followZoomOverride: false };
card.isConnected = false;
const location = (lat, lng) => new context.google.maps.LatLng(lat, lng);
const entity = () => ({ last_updated: new Date().toISOString() });

card._updateMotion("car", location(0, 0), { velocidade: "speed" }, entity());
card._updateMotion("car", location(0, 0.0001), { velocidade: "speed" }, entity());
const motion = card._motion.car;
assert.ok(motion.heading !== null, "two GPS positions establish direction");
const predicted = card._positionForMotion(motion, motion.receivedAt + 2000);
assert.ok(predicted.lng > motion.real.lng, "moving car advances beyond last GPS position");
const capped = card._positionForMotion(motion, motion.receivedAt + 4000);
assert.ok(card._distanceMeters(motion.real, capped) <= 80.1, "prediction is distance limited");
const stale = card._positionForMotion(motion, motion.receivedAt + 4100);
assert.equal(stale.lng, capped.lng, "prediction stops without jumping backward");

card._config.prever_movimento = false;
assert.equal(card._positionForMotion(motion, motion.receivedAt + 1000), motion.real,
  "disabled flag shows GPS position");
const samePoint = card._updateMotion("car", location(0, 0.0001), { velocidade: "speed" }, entity());
assert.equal(samePoint.lng, motion.real.lng, "disabled flag immediately uses GPS on unchanged updates");

card._config.prever_movimento = true;
card._hass.states.speed.state = "0";
card._updateMotion("car", location(0, 0.0001), { velocidade: "speed" }, entity());
assert.equal(card._motion.car.speed, 0, "zero speed stops extrapolation");

let zoom = 19;
card._map = { getZoom: () => zoom, setZoom: (value) => { zoom = value; } };
card._shouldFollow = () => true;
card._config.ajuste_zoom_seguir = 2;
card._applyFollowZoomAdjustment();
assert.equal(zoom, 20, "positive offset applies after the normal zoom cap");
zoom = 17;
card._config.ajuste_zoom_seguir = -3;
card._applyFollowZoomAdjustment();
assert.equal(zoom, 14, "negative offset zooms out from fitted level");
zoom = 19;
card._shouldFollow = () => false;
card._applyFollowZoomAdjustment();
assert.equal(zoom, 18, "offset has no effect outside follow mode");

class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.listeners = {}; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  setAttribute() {}
}
context.document = {
  createElement: (tag) => new Element(tag),
  createTextNode: (text) => ({ text }),
};
card.controlsContainer = new Element("div");
card._config = { entities: [], prever_movimento: false, ajuste_zoom_seguir: -2 };
card._uiState = { entityVisibility: {}, followZoomOverride: false, motionOverride: false };
card._saveUIState = () => {};
card._updateMap = () => {};
card._renderControls();
const menu = card.controlsContainer.children.find((child) => child.className.includes("options-menu"));
const label = (name) => menu.children.find((child) => child.tag === "label" &&
  child.children.some((part) => part.text === name));
const zoomControl = label("Zoom relativo")?.children.find((child) => child.tag === "input");
const motionControl = label("Prever movimento")?.children.find((child) => child.tag === "input");
assert.ok(zoomControl && motionControl, "both controls exist in the card options menu");
assert.equal(zoomControl.value, "-2", "menu starts with the YAML zoom offset");
assert.equal(motionControl.checked, false, "menu starts with the YAML motion flag");
zoomControl.value = "3";
zoomControl.listeners.change({ stopPropagation() {} });
assert.equal(card._getFollowZoomOffset(), 3, "menu zoom setting overrides the YAML default");
motionControl.checked = true;
motionControl.listeners.change({ stopPropagation() {} });
assert.equal(card._isMotionEnabled(), true, "menu motion setting overrides the YAML default");

console.log("Google Maps motion tests passed");
