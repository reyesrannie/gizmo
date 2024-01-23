import { ThemeProvider, createTheme } from "@mui/material";
import "./App.scss";
import Login from "./screen/login/Login";
import Dashboard from "./screen/dashboard/Dashboard";
import AppBar from "./components/customs/AppBar";

function App() {
  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#f4ce92",
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
      <AppBar />
    </ThemeProvider>
  );
}

export default App;
