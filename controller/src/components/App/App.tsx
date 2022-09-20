import { ThemeProvider } from "@emotion/react";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import React, { Fragment, useEffect, useState } from "react";
import Connection from "../../shared/connection";
import { MessageTypes } from "../../shared/constants/message";
import { muiTheme } from "../../shared/utils/styles";
import AppBar from "../AppBar";
import ControllerView from "../ControllerView";
import MapView from "../MapView";
import SideMenu from "../SideMenu";
import BaseStyles from "./BaseStyles";
import { Views } from "./Styles";

export enum AppViews {
  CONTROLLER = "controller",
  MAP = "map",
}

const App = () => {
  const [connection, setConnection] = useState<null | Connection>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [calibrationInProgress, setCalibrationInProgress] = useState(false);
  const [diskSpace, setDiskSpace] = useState(undefined);
  const [quadRotation, setQuadRotation] = useState({ x: 0, y: 0 });
  const [view, setView] = useState(AppViews.CONTROLLER);
  const [openConnectionErr, setOpenConnectionErr] = useState(false);

  const connect = () => {
    const newConnection = new Connection();
    setConnection(newConnection);
    newConnection.onOpen(() => {
      setConnectionStatus(true);
    });
    newConnection.onClose(() => {
      setConnectionStatus(false);
    });
    newConnection.onError(() => {
      setOpenConnectionErr(true);
    });
    newConnection.onMessage((message) => {
      switch (message.type) {
        case MessageTypes.POSE:
          setQuadRotation(message.pose.angles);
          setDiskSpace(message.diskSpace);
        case MessageTypes.CALIBRATION:
          setCalibrationInProgress(message.status == "in_progress");
      }
    });
  };

  useEffect(() => {
    connect();
  }, []);

  const onClickConnect = () => {
    !connectionStatus && connect();
  };

  const onCalibrate = () => {
    connection?.sendMessage({
      type: MessageTypes.CALIBRATION,
      calibrate: true,
    });
  };

  const toggleView = () => {
    if (view == AppViews.CONTROLLER) setView(AppViews.MAP);
    else setView(AppViews.CONTROLLER);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenConnectionErr(false);
  };

  return (
    <Fragment>
      <BaseStyles />
      <ThemeProvider theme={muiTheme}>
        <AppBar
          isConnected={connectionStatus}
          diskSpace={diskSpace}
          onCalibrate={onCalibrate}
          isCalibrating={calibrationInProgress}
        />
        <SideMenu appView={view} toggleView={toggleView}></SideMenu>
        <Views>
          {view == AppViews.CONTROLLER && (
            <ControllerView
              connection={connection}
              quadRotation={quadRotation}
              onConnect={onClickConnect}
            ></ControllerView>
          )}
          {view == AppViews.MAP && <MapView></MapView>}
        </Views>
        <Snackbar
          key="connection-err"
          color="warn"
          onClose={handleClose}
          autoHideDuration={6000}
          open={openConnectionErr}
        >
          <MuiAlert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleClose}>
                Ok
              </Button>
            }
          >
            Can't connect to the quadcopter
          </MuiAlert>
        </Snackbar>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
