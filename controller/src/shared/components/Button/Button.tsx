import React from "react";
import { ButtonEl } from "./Styles";

const Button = (props) => {
  return <ButtonEl onClick={props.onClick}>{props.children}</ButtonEl>;
};

export default Button;
