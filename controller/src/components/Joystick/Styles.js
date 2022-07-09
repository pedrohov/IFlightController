import styled from "styled-components";

export const OuterRing = styled.div`
  display: flex;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &.active {
    background-color: rgba(0, 0, 0, 0.4);
  }

  &.active:before {
    opacity: 0.8;
    width: 108%;
    height: 108%;
  }

  &:before {
    width: 100%;
    height: 100%;
    border: 2px solid #fff;
    position: absolute;
    content: "";
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.35s, width 0.2s, height 0.2s;
  }
`;

export const Handle = styled.div`
  width: 40%;
  height: 40%;
  border-radius: 50%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: background-color 0.2s;
  touch-action: none; /* Ignore browser touch events (pan, zoom) */

  &.active {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export const IconContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  color: #fff;
  opacity: 0.6;
  pointer-events: none;
  font-weight: bold;
`;

export const HorizontalIcons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 20px;
`;

export const VerticalIcons = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  align-items: center;
  padding: 20px;
  text-align: center;
`;
