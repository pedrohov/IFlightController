import React, { Fragment, useEffect, useState } from "react";
import { JoystickMode, Rotation } from "../../shared/constants/rotation";
import { onMessage, sendMessage } from "../../shared/websocket";
import AppBar from "../AppBar";
import Joystick from "../Joystick";
import BaseStyles from "./BaseStyles";
import { JoystickArea } from "./Styles";

const App = () => {
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
    sendMessage(updatedRotation);
  };

  const onRollPitchChange = (pitch: number, roll: number) => {
    const updatedRotation = {
      [Rotation.THROTTLE]: rotation.THROTTLE,
      [Rotation.YAW]: rotation.YAW,
      [Rotation.PITCH]: pitch,
      [Rotation.ROLL]: roll,
    };
    setRotation(updatedRotation);
    sendMessage(updatedRotation);
  };

  useEffect(() => {
    onMessage((event: MessageEvent) => console.log(event.data));
  }, []);

  return (
    <Fragment>
      <BaseStyles />
      <AppBar />
      <JoystickArea>
        <Joystick
          type={JoystickMode.YAW_THROTTLE}
          onMove={onYawThrottleChange}
        />
        <Joystick type={JoystickMode.ROLL_PITCH} onMove={onRollPitchChange} />
      </JoystickArea>
    </Fragment>
  );
};

export default App;
