import { createTheme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const PRIMARY = "#F96900";
export const SECONDARY = "#A8DCD1";
export const BACKGROUND = "#DCE2C8";

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: "#fff",
    },
    secondary: {
      main: SECONDARY,
      contrastText: "#fff",
    },
    inversePrimary: {
      main: "#fff",
      contrastText: PRIMARY,
    },
    dark: {
      main: "#000",
      contrastText: "#fff",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1em",
          color: "white",
          backgroundColor: PRIMARY,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: 0,
        },
        paper: {
          marginTop: 48,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});

export const getSize = () => {
  const theme = useTheme();
  const isWidescreen = !useMediaQuery(theme.breakpoints.down("lg"));
  return {
    titleSize: isWidescreen ? 55 : 45,
    subtitleSize: isWidescreen ? 35 : 30,
    textSize: isWidescreen ? 20 : 18,
    isWidescreen: isWidescreen,
  };
};
