import Icon from "@mui/material/Icon";
import React, { Fragment } from "react";
import { AppBarBackground, LeftMenu, RightMenu } from "./Styles";

export interface DiskSpace {
  diskPath: string;
  free: number;
  size: number;
}
export interface AppBarProps {
  diskSpace: DiskSpace | undefined;
  isConnected: boolean | undefined;
}

const AppBar = (props: AppBarProps) => {
  return (
    <AppBarBackground>
      <LeftMenu>
        {props.isConnected && props.diskSpace && (
          <Fragment>
            <Icon fontSize="small" className="material-icons-outlined">
              sim_card
            </Icon>
            <span>
              {(props.diskSpace.free / 1e9).toFixed(1)} /&nbsp;
              {(props.diskSpace.size / 1e9).toFixed(1)} GB
            </span>
          </Fragment>
        )}
      </LeftMenu>
      <RightMenu>
        <Icon fontSize="small">{props.isConnected ? "wifi" : "wifi_off"}</Icon>
        {props.isConnected && <Icon fontSize="small">battery_4_bar</Icon>}
        <Icon fontSize="small">settings</Icon>
      </RightMenu>
    </AppBarBackground>
  );
};

export default AppBar;
