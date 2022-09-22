import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { AppViews } from "../App/App";
import { SideMenuWrapper } from "./Styles";

const SideMenu = ({ appView, toggleView }) => {
  return (
    <SideMenuWrapper>
      <IconButton onClick={toggleView}>
        <Icon fontSize="small">
          {appView == AppViews.CONTROLLER ? "map" : "close"}
        </Icon>
      </IconButton>
    </SideMenuWrapper>
  );
};

export default SideMenu;
