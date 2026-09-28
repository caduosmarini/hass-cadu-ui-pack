const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../dist/google-maps-car-card-cadu/card.js"), "utf8")
  .replace(/^import .*;\r?\n/m, "")
  .replace(/export \{ GoogleMapsCarCardCadu \};/, "globalThis.Card = GoogleMapsCarCardCadu;");
let createdBoxes = 0;
let createdLines = 0;
class LatLng {
  constructor(lat, lng) { this._lat = lat; this._lng = lng; }
  lat() { return this._lat; }
  lng() { return this._lng; }
}
class Marker {
  constructor(options) { this.position = options.position; }
  getPosition() { return this.position; }
  setPosition(position) { this.position = position; }
  setTitle() {}
}
class OverlayView {
  constructor() { createdBoxes += 1; this.setMapCalls = 0; }
  getMap() { return this.map || null; }
  setMap(map) { this.map = map; this.setMapCalls += 1; }
  getProjection() { return null; }
}
class Polyline {
  constructor() { createdLines += 1; this.removed = false; }
  setMap(map) { if (!map) this.removed = true; }
}
const context = {
  HTMLElement: class {},
  google: { maps: { LatLng, Marker, OverlayView, Polyline, Size: class {}, Point: class {} } },
  requestAnimationFrame: () => 1,
};
vm.runInNewContext(source, context);
const card = Object.create(context.Card.prototype);
card._config = { entities: [{ entity: "car" }], prever_movimento: false };
card._uiState = { entityVisibility: {}, rotateImageEnabled: false, arrowEnabled: true };
card._hass = { states: { car: {
  state: "home",
  last_updated: new Date().toISOString(),
  attributes: { latitude: -30.1, longitude: -51.2 },
} } };
card._map = {};
card.markers = {};
card.infoBoxes = {};
card.lastPositions = {};
card._motion = {};
card._motionFrame = null;
card._lastFollowBoundsKey = null;
card._recordTrailPoint = () => {};
card._renderTrail = () => {};
card._shouldFollow = () => true;
let fits = 0;
card._fitMapBounds = () => { fits += 1; };

card._updateMap();
const firstBox = card.infoBoxes.car;
card._updateMap();
assert.equal(card.infoBoxes.car, firstBox, "unchanged HA state keeps the same info box");
assert.equal(createdBoxes, 1, "only one info box is created");
assert.equal(firstBox.setMapCalls, 1, "info box is not detached and reattached");
assert.equal(fits, 1, "unchanged position does not refit map");
card._hass.states.car.attributes.longitude = -51.3;
card._updateMap();
assert.equal(fits, 2, "new GPS position refits map once");

let styleChanges = 0;
card._map = { setOptions: () => { styleChanges += 1; } };
card._uiState.nightModeEnabled = false;
card._lastNightMode = null;
card._applyNightMode();
card._applyNightMode();
assert.equal(styleChanges, 1, "unchanged night mode does not restyle tiles");
card._uiState.nightModeEnabled = true;
card._applyNightMode();
assert.equal(styleChanges, 2, "night mode change updates style");

let trafficChanges = 0;
card.trafficLayer = { setMap: () => { trafficChanges += 1; } };
card._lastTrafficEnabled = null;
card._uiState.trafficEnabled = false;
card._toggleTrafficLayer();
card._toggleTrafficLayer();
assert.equal(trafficChanges, 1, "unchanged traffic state does not reset layer");
card._uiState.trafficEnabled = true;
card._toggleTrafficLayer();
assert.equal(trafficChanges, 2, "traffic change updates layer");

card.trails = { car: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] };
card.trailPolylines = {};
card._trailRenderKeys = {};
card._getTrailConfig = () => ({ enabled: true, color: "#fff" });
card._renderTrail = context.Card.prototype._renderTrail;
card._renderTrail("car", {});
card._renderTrail("car", {});
assert.equal(createdLines, 1, "unchanged trail does not redraw");
card.trails.car.push({ lat: 3, lng: 3 });
card._renderTrail("car", {});
assert.equal(createdLines, 3, "new trail point redraws two segments");

console.log("Google Maps flicker tests passed");
