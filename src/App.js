import { ThemeProvider, createTheme } from "@mui/material";
import "./App.scss";
import Login from "./screen/login/Login";
import Dashboard from "./screen/dashboard/Dashboard";
import AppBar from "./components/customs/AppBar";
import Routing from "./services/routes/Routing";
import { SnackbarProvider } from "notistack";

function App() {
  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#1a1d24",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            backgroundColor: "#15253B",
            "&:hover": {
              backgroundColor: "#1C315F",
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Routing />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
