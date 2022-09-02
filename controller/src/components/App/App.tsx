import React, { Fragment, useEffect, useState } from "react";
import Button from "../../shared/components/Button";
import Connection from "../../shared/connection";
import { MessageTypes } from "../../shared/constants/message";
import { JoystickMode, Rotation } from "../../shared/constants/rotation";
import AppBar from "../AppBar";
import Joystick from "../Joystick";
import RotationViewer from "../RotationViewer";
import BaseStyles from "./BaseStyles";
import { ConnectArea, JoystickArea } from "./Styles";

const App = () => {
  const [connection, setConnection] = useState<null | Connection>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [diskSpace, setDiskSpace] = useState(undefined);
  const [quadRotation, setQuadRotation] = useState({ x: 0, y: 0 });

  const connect = () => {
    const newConnection = new Connection();
    setConnection(newConnection);
    newConnection.onOpen(() => {
      setConnectionStatus(true);
    });
    newConnection.onClose(() => {
      setConnectionStatus(false);
    });
    newConnection.onMessage((message) => {
      setQuadRotation(message.pose.angles);
      setDiskSpace(message.diskSpace);
    });
  };

  useEffect(() => {
    connect();
  }, []);

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
    connection?.sendMessage({
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
    connection?.sendMessage({
      ...updatedRotation,
      type: MessageTypes.CONTROLLER_INPUT,
    });
  };

  const onClickConnect = () => {
    !connectionStatus && connect();
  };

  const onCalibrate = () => {
    connection?.sendMessage({
      type: MessageTypes.CALIBRATION,
      calibrate: true,
    });
  };

  return (
    <Fragment>
      <BaseStyles />
      <AppBar
        isConnected={connectionStatus}
        diskSpace={diskSpace}
        onCalibrate={onCalibrate}
      />
      {!connectionStatus && (
        <ConnectArea>
          <Button onClick={onClickConnect}>Connect</Button>
        </ConnectArea>
      )}
      {connectionStatus && <RotationViewer {...quadRotation}></RotationViewer>}
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
