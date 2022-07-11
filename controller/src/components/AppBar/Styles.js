import styled from "styled-components";
import { sizes } from "../../shared/utils/styles";

export const AppBarBackground = styled.div`
  width: 100%;
  height: ${sizes.navbarHeight}px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
`;

export const LeftMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 1px;
  font-size: 0.875rem;
`;

export const RightMenu = styled.div`
  height: 100%;
  display: flex;
  align-self: flex-end;
  align-items: center;
  gap: 20px;
`;
