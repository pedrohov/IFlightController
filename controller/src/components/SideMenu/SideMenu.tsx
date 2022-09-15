import React from "react";
import { SideMenuWrapper } from "./Styles";
import IconButton from "../../shared/components/IconButton";
import Icon from "@mui/material/Icon";
import { AppViews } from "../App/App";

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
