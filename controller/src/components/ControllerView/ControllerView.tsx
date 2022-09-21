import React, { useState } from "react";
import { MessageTypes } from "../../shared/constants/message";
import { JoystickMode, Rotation } from "../../shared/constants/rotation";
import Joystick from "../Joystick";
import RotationViewer from "../RotationViewer";
import { ConnectArea, JoystickArea } from "./Styles";
import Button from "@mui/material/Button";

export const ControllerView = (props) => {
  const [rotation, setRotation] = useState({
    [Rotation.THROTTLE]: 0,
    [Rotation.YAW]: 0,
    [Rotation.PITCH]: 0,
    [Rotation.ROLL]: 0,
  });

  const onYawThrottleChange = (yaw: number, throttle: number) => {
    const updatedRotation = {
      [Rotation.THROTTLE]: throttle,
      [Rotation.YAW]: yaw,
      [Rotation.PITCH]: rotation.PITCH,
      [Rotation.ROLL]: rotation.ROLL,
    };
    setRotation(updatedRotation);
    props.connection?.sendMessage({
      ...updatedRotation,
      type: MessageTypes.CONTROLLER_INPUT,
    });
  };

  const onRollPitchChange = (pitch: number, roll: number) => {
    const updatedRotation = {
      [Rotation.THROTTLE]: rotation.THROTTLE,
      [Rotation.YAW]: rotation.YAW,
      [Rotation.PITCH]: pitch,
      [Rotation.ROLL]: roll,
    };
    setRotation(updatedRotation);
    props.connection?.sendMessage({
      ...updatedRotation,
      type: MessageTypes.CONTROLLER_INPUT,
    });
  };

  return (
    <>
      {!props.connection?.isConnected && (
        <ConnectArea>
          <Button
            color="inherit"
            variant="outlined"
            style={{ color: "#fff" }}
            onClick={props.onConnect}
          >
            Connect
          </Button>
        </ConnectArea>
      )}
      {props.connection?.isConnected && (
        <RotationViewer {...props.quadRotation}></RotationViewer>
      )}
      <JoystickArea>
        <Joystick
          type={JoystickMode.YAW_THROTTLE}
          onMove={onYawThrottleChange}
        />
        <Joystick type={JoystickMode.ROLL_PITCH} onMove={onRollPitchChange} />
      </JoystickArea>
    </>
  );
};

export default ControllerView;
