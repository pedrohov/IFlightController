import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import { transform } from "ol/proj";
import OSM from "ol/source/OSM";
import View from "ol/View";
import React, { useEffect, useRef, useState } from "react";
import LayerMenu from "../LayerMenu";
import { MapViewWrapper } from "./Styles";

const MapView = (props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<null | Map>(null);

  useEffect(() => {
    const osm = new TileLayer({
      source: new OSM(),
    });
    const view = new View({
      center: [-6500000, -1700000],
      resolution: 4900,
      minZoom: 4,
      maxZoom: 17,
    });
    const map = new Map({
      layers: [osm],
      view,
    });

    map.setTarget(mapContainer.current || undefined);
    setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        view.setCenter(
          transform(
            [position.coords.longitude, position.coords.latitude],
            "EPSG:4326",
            "EPSG:3857"
          )
        );
        view.setZoom(16);
      });
    }
  }, []);

  return (
    <MapViewWrapper ref={mapContainer}>
      {map && <LayerMenu mapRef={map}></LayerMenu>}
      {props.children}
    </MapViewWrapper>
  );
};

export default MapView;
