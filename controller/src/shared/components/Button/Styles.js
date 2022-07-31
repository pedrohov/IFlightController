import styled from "@emotion/styled";

export const ButtonEl = styled.button`
  border: 1px solid #fff;
  padding: 0 15px;
  line-height: 34px;
  border-radius: 4px;
  min-width: 64px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
