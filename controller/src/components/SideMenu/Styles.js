import styled from "styled-components";

import { sizes } from "shared/utils/styles.js";

export const SideMenuWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px;
  border-radius: 8px;
  position: absolute;
  top: ${sizes.navbarHeight + 15}px;
  left: 15px;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
