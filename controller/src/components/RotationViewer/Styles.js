import styled from "styled-components";

export const RotationViewerWrapper = styled.div`
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

export const RotationViewerPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background-color: #85FFBD;
    background-image: linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%);

`

export const RotationViewerShadow = styled.div`
    position: absolute;
    top: 0;
    left: -10%;
    width: 120%;
    height: 120%;
    background-color: rgba(0,0,0,.15);
    filter: blur(20px);
    z-index: -1;
`