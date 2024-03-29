import Icon from "@mui/material/Icon";
import React, { useEffect, useRef, useState } from "react";
import { JoystickMode } from "../../shared/constants/rotation";
import {
  Handle,
  HorizontalIcons,
  IconContainer,
  OuterRing,
  VerticalIcons,
} from "./Styles";

export interface JoystickProps {
  type: JoystickMode;
  onMove: (x: number, y: number) => any;
}

const Joystick = (props: JoystickProps) => {
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [radius, setRadius] = useState(0);
  const [pointerId, setPointerId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const outerRingRef = useRef<HTMLDivElement>();

  const dragStart = (event) => {
    setPointerId(event.pointerId);
    event.preventDefault();
    setIsDragging(true);
    setDiffX(event.screenX);
    setDiffY(event.screenY);
  };

  useEffect(() => {
    const dragEnd = (event) => {
      if (event.pointerId != pointerId) return;
      props.onMove(0, 0);
      setPointerId(null);
      setIsDragging(false);
      setPosition({
        x: 0,
        y: 0,
      });
    };

    const drag = (event) => {
      if (!isDragging || event.pointerId != pointerId) return;
      let x = event.screenX - diffX;
      let y = event.screenY - diffY;
      const angle = Math.atan2(y, x);
      const limitX = radius * Math.cos(angle);
      const limitY = radius * Math.sin(angle);

      x =
        limitX > 0
          ? Math.min(event.screenX - diffX, limitX)
          : Math.max(event.screenX - diffX, limitX);
      y =
        limitY > 0
          ? Math.min(event.screenY - diffY, limitY)
          : Math.max(event.screenY - diffY, limitY);

      setPosition({ x, y });
      props.onMove(x / radius, -y / radius);
    };

    document.addEventListener("pointerup", dragEnd);
    document.addEventListener("pointermove", drag);
    setRadius(
      outerRingRef.current ? outerRingRef.current.offsetWidth * 0.5 : 0
    );
    return () => {
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointermove", drag);
    };
  }, [dragStart, outerRingRef.current]);

  let icons;
  if (props.type == JoystickMode.YAW_THROTTLE) {
    icons = (
      <IconContainer className="icons">
        <HorizontalIcons>
          <Icon>360</Icon>
          <Icon style={{ transform: "scaleX(-1)" }}>360</Icon>
        </HorizontalIcons>
        <VerticalIcons>
          <div>UP</div>
          <div>DOWN</div>
        </VerticalIcons>
      </IconContainer>
    );
  } else {
    icons = (
      <IconContainer className="icons">
        <HorizontalIcons>
          <Icon>chevron_left</Icon>
          <Icon>chevron_right</Icon>
        </HorizontalIcons>
        <VerticalIcons>
          <Icon style={{ transform: "rotate(90deg)" }}>chevron_left</Icon>
          <Icon style={{ transform: "rotate(-90deg)" }}>chevron_left</Icon>
        </VerticalIcons>
      </IconContainer>
    );
  }

  return (
    <OuterRing ref={outerRingRef} className={isDragging ? "active" : ""}>
      {icons}
      <Handle
        className={isDragging ? "active" : ""}
        style={{ left: position.x, top: position.y }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={dragStart}
      />
    </OuterRing>
  );
};

export default Joystick;
