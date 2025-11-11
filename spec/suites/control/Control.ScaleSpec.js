import { LeafletMap, Control } from "leaflet";

describe("Control.Scale", () => {
  it("can be added to an unloaded map", () => {
    const map = new LeafletMap(document.createElement("div"));
    new Control.Scale().addTo(map);
  });
});
