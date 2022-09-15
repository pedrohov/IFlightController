import { createTheme } from "@mui/material/styles";

export const sizes = {
  navbarHeight: 50,
};

export const font = {
  regular: 'font-family: "Roboto", sans-serif; font-weight: normal;',
  medium: 'font-family: "Roboto", sans-serif; font-weight: normal;',
  bold: 'font-family: "Roboto", sans-serif; font-weight: normal;',
  black: 'font-family: "Roboto", sans-serif; font-weight: normal;',
  size: (size) => `font-size: ${size}px;`,
};

export const muiTheme = createTheme({
  palette: {
    primary: {
      light: "#6effff",
      main: "#00e6ff",
      dark: "#00b3cc",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    mode: "dark",
  },
});
