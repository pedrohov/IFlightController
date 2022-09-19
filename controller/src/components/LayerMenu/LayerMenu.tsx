import { Checkbox, FormControlLabel } from "@mui/material";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import React, { useEffect, useState } from "react";
import { LayerMenuWrapper } from "./Styles";

const LayerMenu = ({ mapRef }: { mapRef: Map }) => {
  const [layers] = useState<Record<string, TileLayer<TileWMS>>>({
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
  });

  const toggleLayer = (layer, checked) => {
    if (checked) {
      mapRef?.addLayer(layers[layer]);
      return;
    }
    mapRef?.removeLayer(layers[layer]);
  };

  const layerElements = Object.keys(layers).map((layer) => (
    <FormControlLabel
      label={layer}
      key={layer}
      control={
        <Checkbox
          defaultChecked
          onChange={(e, checked) => toggleLayer(layer, checked)}
        />
      }
      style={{
        color: "#fff",
      }}
    ></FormControlLabel>
  ));

  useEffect(() => {
    Object.values(layers).forEach((layer) => mapRef.addLayer(layer));
  }, [mapRef]);

  return <LayerMenuWrapper>{layerElements}</LayerMenuWrapper>;
};

export default LayerMenu;
