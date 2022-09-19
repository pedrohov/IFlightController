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
  const [isDrawing, setIsDrawing] = useState<null | "Polygon" | "Circle">(null);
  const [delimitedAreasSource, setDelimitedAreasSource] =
    useState<null | VectorSource>(null);
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
    const source = new VectorSource({ wrapX: false });
    setDelimitedAreasSource(source);

    const delimitedAreas = new VectorLayer({
      source,
      zIndex: 1,
    });
    mapRef?.addLayer(delimitedAreas);
    Object.values(layers).forEach((layer) => mapRef?.addLayer(layer));
  }, [mapRef]);

  const drawArea = (type: "Polygon" | "Circle") => {
    if (drawInteraction) {
      mapRef?.removeInteraction(drawInteraction);
    }

    if (type === isDrawing) {
      setIsDrawing(null);
      return;
    }

    const newDrawInteraction = new Draw({
      source: delimitedAreasSource!,
      type,
    });
    setDrawInteraction(newDrawInteraction);
    mapRef?.addInteraction(newDrawInteraction);
    setIsDrawing(type);
  };

  const drawPolygon = () => {
    drawArea("Polygon");
  };

  const drawCircle = () => {
    drawArea("Circle");
  };

  return (
    <LayerMenuWrapper>
      {layerElements}
      <Button onClick={drawPolygon}>Delimit area by polygon</Button>
      <Button onClick={drawCircle}>Delimit area by circle</Button>
    </LayerMenuWrapper>
  );
};

export default LayerMenu;
