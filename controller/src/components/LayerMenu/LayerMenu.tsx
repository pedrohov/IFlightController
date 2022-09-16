import { Checkbox, FormControlLabel } from "@mui/material";
import Draw from "ol/interaction/Draw";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import React, { useEffect, useState } from "react";
import Button from "../../shared/components/Button";
import { LayerMenuWrapper } from "./Styles";

const LayerMenu = ({ mapRef }: { mapRef: Map | null }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawInteraction, setDrawInteraction] = useState<null | Draw>(null);

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
        key={layer}
        control={<Checkbox defaultChecked onChange={toggleLayer} />}
        style={{
          color: "#fff",
        }}
      ></FormControlLabel>
    );
  });

  useEffect(() => {
    const delimitedAreasSource = new VectorSource({ wrapX: false });
    const newDrawInteraction = new Draw({
      source: delimitedAreasSource,
      type: "Polygon",
    });
    setDrawInteraction(newDrawInteraction);

    const delimitedAreas = new VectorLayer({
      source: delimitedAreasSource,
      zIndex: 1,
    });
    mapRef?.addLayer(delimitedAreas);
  }, [mapRef]);

  const drawPolygon = () => {
    if (!drawInteraction) return;
    if (isDrawing) {
      mapRef?.removeInteraction(drawInteraction);
      setIsDrawing(false);
      return;
    }
    mapRef?.addInteraction(drawInteraction);
    setIsDrawing(true);
  };

  return (
    <LayerMenuWrapper>
      {layerElements}
      <Button onClick={drawPolygon}>Delimit area</Button>
    </LayerMenuWrapper>
  );
};

export default LayerMenu;
