import React from "react";
import { IconButtonEl } from "./Styles";

const IconButton = (props) => {
  return <IconButtonEl {...props}>{props.children}</IconButtonEl>;
};

export default IconButton;
