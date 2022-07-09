import React, { Component, Fragment } from "react";
import Joystick from "../Joystick";
import BaseStyles from "./BaseStyles";
import { JoystickArea } from "./Styles";

class App extends Component {
  render() {
    return (
      <Fragment>
        <BaseStyles />
        <JoystickArea>
          <Joystick type="YAW_THROTTLE" />
          <Joystick type="ROLL_PITCH" />
        </JoystickArea>
      </Fragment>
    );
  }
}

export default App;
