import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import View from "ol/View";
import TileWMS from "ol/source/TileWMS";
import React, { useEffect, useRef, useState } from "react";
import { MapViewWrapper } from "./Styles";

const MapView = (props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<null | Map>(null);

  useEffect(() => {
    const osm = new TileLayer({
      source: new OSM(),
    });

    const airports = new TileLayer({
      source: new TileWMS({
        url: "https://geoaisweb.decea.mil.br/geoserver/ICA/wms",
        params: { LAYERS: "ICA:airport" },
      }),
    });

    const heliports = new TileLayer({
      source: new TileWMS({
        url: "https://geoaisweb.decea.mil.br/geoserver/ICA/wms",
        params: { LAYERS: "ICA:heliport" },
      }),
    });

    const map = new Map({
      layers: [osm, airports, heliports],
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
