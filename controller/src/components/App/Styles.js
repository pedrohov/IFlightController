import styled from "styled-components";

import { sizes } from "shared/utils/styles.js";

export const JoystickArea = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  pointer-events: none;
  user-select: none;
`;

export const ConnectArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  position: absolute;
  margin: ${sizes.navbarHeight + 14}px 0;
`;
