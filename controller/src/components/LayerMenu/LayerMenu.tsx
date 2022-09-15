import { Checkbox, FormControlLabel } from "@mui/material";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import React from "react";
import { LayerMenuWrapper } from "./Styles";

const LayerMenu = ({ mapRef }: { mapRef: Map | null }) => {
  const layers = {
    Airports: new TileLayer({
      source: new TileWMS({
        url: "https://geoaisweb.decea.mil.br/geoserver/ICA/wms",
        params: { LAYERS: "ICA:airport" },
      }),
    }),
    Heliports: new TileLayer({
      source: new TileWMS({
        url: "https://geoaisweb.decea.mil.br/geoserver/ICA/wms",
        params: { LAYERS: "ICA:heliport" },
      }),
    }),
  };

  const layerElements = Object.keys(layers).map((layer) => {
    const toggleLayer = (event, checked) => {
      if (checked) {
        mapRef?.addLayer(layers[layer]);
        return;
      }
      mapRef?.removeLayer(layers[layer]);
    };

    mapRef?.addLayer(layers[layer]);

    return (
      <FormControlLabel
        label={layer}
        control={<Checkbox defaultChecked onChange={toggleLayer} />}
        style={{
          color: "#fff",
        }}
      ></FormControlLabel>
    );
  });

  return <LayerMenuWrapper>{layerElements}</LayerMenuWrapper>;
};

export default LayerMenu;
