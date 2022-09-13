import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import View from "ol/View";
import React, { useEffect, useRef, useState } from "react";
import { MapViewWrapper } from "./Styles";

const MapView = (props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<null | Map>(null);

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: [],
      view: new View({
        center: [-6500000, -1700000],
        resolution: 4900,
        minZoom: 4,
        maxZoom: 17,
      }),
    });
    map.setTarget(mapContainer.current || undefined);
    setMap(map);
  }, []);

  return <MapViewWrapper ref={mapContainer}>{props.children}</MapViewWrapper>;
};

export default MapView;
