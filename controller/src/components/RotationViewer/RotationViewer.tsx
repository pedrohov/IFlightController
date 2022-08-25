import React from "react";
import {
  RotationCoordinates,
  RotationViewerPlaceholder,
  RotationViewerShadow,
  RotationViewerWrapper,
} from "./Styles";

export interface RotationViewerProps {
  x: number;
  y: number;
}

const RotationViewer = (props: RotationViewerProps) => {
  const transform = `rotateX(${props.x}deg) rotateY(${props.y}deg)`;
  return (
    <RotationViewerWrapper>
      <RotationViewerPlaceholder
        style={{ transform: transform }}
      ></RotationViewerPlaceholder>
      <RotationViewerShadow></RotationViewerShadow>
      <RotationCoordinates>
        x: {props.x}, y: {props.y}
      </RotationCoordinates>
    </RotationViewerWrapper>
  );
};

export default RotationViewer;
