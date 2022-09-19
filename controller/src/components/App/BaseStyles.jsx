import { createGlobalStyle } from "styled-components";

import { font } from "shared/utils/styles";

export default createGlobalStyle`
  html, body {
    height: 100%;
    min-height: 100%;
    margin: 0;
  }
  body {
    color: rgba(0,0,0,.84);
    -webkit-tap-highlight-color: transparent;
    line-height: 1.2;
    ${font.size(16)}
    ${font.regular}
    background: #355C7D;  
    background: -webkit-linear-gradient(to bottom, #81bfbc,#355C7D); 
    background: linear-gradient(to bottom,#81bfbc,#355C7D);
  }
  #root {
    display: flex;
    flex-direction: column;
    height: 100%
  }
  * {
    box-sizing: border-box;
  }
  button,
  input,
  select,
  textarea {
    ${font.regular}
  }
  h1, h2, h3, h4, h5, h6, strong {
    ${font.bold}
  }
  button {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 500;
  }
  p {
    line-height: 1.5;
  }
  textarea {
    line-height: 1.5;
  }
  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    touch-action: none;
  }
`;
