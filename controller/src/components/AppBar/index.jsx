import React from "react";
import { AppBarBackground, LeftMenu, RightMenu } from "./Styles";
import Icon from "@mui/material/Icon";

const AppBar = (props) => {
  return (
    <AppBarBackground>
      <LeftMenu>
        <Icon fontSize="small" className="material-icons-outlined">
          sim_card
        </Icon>
        <span>1.2/4GB</span>
      </LeftMenu>
      <RightMenu>
        <Icon fontSize="small">wifi</Icon>
        <Icon fontSize="small">battery_4_bar</Icon>
        <Icon fontSize="small">settings</Icon>
      </RightMenu>
    </AppBarBackground>
  );
};

export default AppBar;
