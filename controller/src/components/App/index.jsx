import React, { Fragment } from "react";
import AppBar from "../AppBar";
import Joystick from "../Joystick";
import BaseStyles from "./BaseStyles";
import { JoystickArea } from "./Styles";

const App = () => {
  return (
    <Fragment>
      <BaseStyles />
      <AppBar />
      <JoystickArea>
        <Joystick type="YAW_THROTTLE" />
        <Joystick type="ROLL_PITCH" />
      </JoystickArea>
    </Fragment>
  );
};

export default App;
