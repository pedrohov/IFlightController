import React, { Component, Fragment } from "react";
import Joystick from "../Joystick";
import BaseStyles from "./BaseStyles";

class App extends Component {
  render() {
    return (
      <Fragment>
        <BaseStyles />
        <Joystick />
      </Fragment>
    );
  }
}

export default App;
