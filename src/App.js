import {
  IconButton,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import "./App.scss";

import Routing from "./services/routes/Routing";
import CloseIcon from "@mui/icons-material/Close";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CacheBuster from "react-cache-buster";
import pkg from "../package.json";

function App() {
  const screenHS = useMediaQuery("(max-height:681px)");
  const { version } = pkg;
  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#f2f2f2",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            padding: "10px",
            borderRadius: "15px",
            "&:hover": {
              backgroundColor: "#f2f2f2",
              cursor: "pointer",
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          listbox: {
            fontFamily: "Roboto-Light",
            letterSpacing: "1px",
            fontSize: screenHS ? "12px" : "16px",
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            color: "#f4ce92 !important", // Change text color
            fontFamily: "Roboto-Bold !important",
          },
          icon: {
            color: "#f4ce92 !important",
          },
        },
      },
    },

    palette: {
      primary: {
        main: "#15253B",
      },
      secondary: {
        main: "#f4ce92",
      },
      warning: {
        main: "#B6622d",
      },
      text: {
        primary: "#1a1d24",
      },
      common: {
        white: "#fff",
        inherit: "#1a1d24",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CacheBuster currentVersion={version} isEnabled={true}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          action={(key) => (
            <IconButton onClick={() => closeSnackbar(key)}>
              <CloseIcon className="icon-properties" />
            </IconButton>
          )}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routing />
          </LocalizationProvider>
        </SnackbarProvider>
      </CacheBuster>
    </ThemeProvider>
  );
}

export default App;
