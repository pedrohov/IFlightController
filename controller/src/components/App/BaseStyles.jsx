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
  button,
  input,
  optgroup,
  select,
  textarea {
    ${font.regular}
  }
  *, *:after, *:before, input[type="search"] {
    box-sizing: border-box;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  ul {
    list-style: none;
  }
  ul, li, ol, dd, h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
  }
  h1, h2, h3, h4, h5, h6, strong {
    ${font.bold}
  }
  button {
    background: none;
    border: none;
  }
  /* Workaround for IE11 focus highlighting for select elements */
  select::-ms-value {
    background: none;
    color: #42413d;
  }
  [role="button"], button, input, select, textarea {
    outline: none;
    &:focus {
      outline: none;
    }
    &:disabled {
      opacity: 1;
    }
  }
  [role="button"], button, input, textarea {
    appearance: none;
  }
  p {
    line-height: 1.4285;
  }
  textarea {
    line-height: 1.4285;
  }
  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    touch-action: manipulation;
  }
`;
