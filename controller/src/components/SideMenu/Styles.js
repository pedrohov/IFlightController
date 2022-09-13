import styled from "styled-components";

import { sizes } from "shared/utils/styles.js";

export const SideMenuWrapper = styled.div`
  position: absolute;
  top: ${sizes.navbarHeight + 15}px;
  left: 15px;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
