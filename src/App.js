import { IconButton, ThemeProvider, createTheme } from "@mui/material";
import "./App.scss";

import Routing from "./services/routes/Routing";
import CloseIcon from "@mui/icons-material/Close";
import { SnackbarProvider, closeSnackbar } from "notistack";

function App() {
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
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={(key) => (
          <IconButton onClick={() => closeSnackbar(key)}>
            <CloseIcon className="icon-properties" />
          </IconButton>
        )}
      >
        <Routing />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
