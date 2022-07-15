import React, { Fragment, useEffect } from "react";
import { JoystickMode, Rotation } from "../../shared/constants/rotation";
import { onMessage, sendMessage } from "../../shared/websocket";
import AppBar from "../AppBar";
import Joystick from "../Joystick";
import BaseStyles from "./BaseStyles";
import { JoystickArea } from "./Styles";

const App = () => {
  const onYawThrottleChange = (yaw: number, throttle: number) => {
    sendMessage({
      [Rotation.THROTTLE]: throttle,
      [Rotation.YAW]: yaw,
    });
  };

  const onRollPitchChange = (pitch: number, roll: number) => {
    sendMessage({
      [Rotation.PITCH]: pitch,
      [Rotation.ROLL]: roll,
    });
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
