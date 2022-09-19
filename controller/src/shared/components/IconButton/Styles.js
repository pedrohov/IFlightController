import styled from "@emotion/styled";

export const IconButtonEl = styled.button`
  color: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover:enabled {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
