import Icon from "@mui/material/Icon";
import React, { Fragment } from "react";
import { AppBarBackground, LeftMenu, RightMenu } from "./Styles";

export interface AppBarProps {
  isConnected: boolean | undefined;
}

const AppBar = (props: AppBarProps) => {
  return (
    <AppBarBackground>
      <LeftMenu>
        {props.isConnected && (
          <Fragment>
            <Icon fontSize="small" className="material-icons-outlined">
              sim_card
            </Icon>
            <span>1.2/4GB</span>
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
