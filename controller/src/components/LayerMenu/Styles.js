import styled from "styled-components";

import { sizes } from "shared/utils/styles.js";

export const LayerMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${sizes.navbarHeight + 15}px;
  left: 74px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 14px;
  border-radius: 8px;
  gap: 7px;
}
`;
