import React from "react";
import {
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
    </RotationViewerWrapper>
  );
};

export default RotationViewer;
