import React from "react"

import { BrowserRouter as Router, Route } from "react-router-dom"

import { useTypedSelector } from "./reducers"

import { Container } from "@material-ui/core"

import PrivateRoute from "./components/util/PrivateRoute"

import Alerts from "./components/util/Alerts"
import Navbar from "./components/navigation/Navbar"
import Footer from "./components/navigation/Footer"
import Landing from "./components/landing/Landing"
import Login from "./components/userForms/Login"

import Dashboard from "./components/dashboard/Dashboard"

import PlantMonitor from "./components/plantMonitor/PlantMonitor"

import { ThemeProvider, createMuiTheme, createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appContainer: {
      padding: "0",
      minHeight: "100vh",
      position: "relative",
    },
    contentWrap: {
      padding: "0",
      paddingBottom: "4rem",
    },
  })
)

function App() {
  const isDarkMode = useTypedSelector((state) => state.darkModeState.isDarkMode)

  /* Creating custom material-ui themes */
  const lightTheme = createMuiTheme({
    palette: {
      type: "light",
      primary: {
        light: "#60AD5E",
        main: "#2E7D32",
        dark: "#005005",
      },
      secondary: {
        light: "#7C43BD",
        main: "#4a148c",
        dark: "#12005E",
      },
      background: {
        default: "#FAFAFA",
        paper: "#F0F1F9",
      },
    },
  })

  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        light: "#58A5F0",
        main: "#0277BD",
        dark: "#004C8C",
      },
      secondary: {
        light: "#757DE8",
        main: "#3F51B5",
        dark: "#002984",
      },
      background: {
        default: "#303030",
        paper: "#525252",
      },
    },
  })

  const classes = useStyles()

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router>
        <Container
          maxWidth={false}
          className={classes.appContainer}
          style={{
            backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
          }}
        >
          <Container maxWidth={false} className={classes.contentWrap}>
            <Navbar />
            <Alerts />
            <Route exact path='/'>
              <Landing />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
            <PrivateRoute path='/dashboard'>
              <Dashboard />
            </PrivateRoute>
            <PrivateRoute path='/plantMonitor'>
              <PlantMonitor />
            </PrivateRoute>
          </Container>
          <Footer />
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
