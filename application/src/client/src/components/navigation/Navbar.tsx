import React, { useState } from "react"

import { Link } from "react-router-dom"

import { useTypedSelector } from "../../reducers"
import { useDispatch } from "react-redux"
import { userLogout } from "../../actions/auth"
import { setDarkMode, setLightMode } from "../../actions/darkMode"

import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import { AppBar, Toolbar, Typography, Button, IconButton, Container } from "@material-ui/core/"

import MenuIcon from "@material-ui/icons/Menu"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import NightsStayIcon from "@material-ui/icons/NightsStay"

import NavDrawer from "./NavDrawer"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    logo: {
      backgroundColor: "whitesmoke",
      borderRadius: "35px",
      padding: "5px 8px",
      fontWeight: 500,
    },
    linkStyle: {
      textDecoration: "none",
      color: "white",
    },
    linkContainer: {
      [theme.breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      },
    },
    navLink: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
      [theme.breakpoints.up("md")]: {
        float: "right",
        display: "block",
        margin: "auto 10px",
      },
    },
    darkModeBtn: {
      float: "right",
      display: "block",
      [theme.breakpoints.down("sm")]: {
        margin: "auto 0",
      },
      [theme.breakpoints.up("md")]: {
        margin: "auto 10px",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export default function Navbar() {
  const theme = useTheme()

  const classes = useStyles()

  const dispatch = useDispatch()

  /* Auth state to choose which nav menu to show */
  const authUser = useTypedSelector((state) => state.authState)

  /* Dark mode state to decide switch button icon */
  const isDarkMode = useTypedSelector((state) => state.darkModeState.isDarkMode)

  /* Toggle collapsable side nav open/close */
  const [sideNav, setSideNav] = useState(false)

  /* Handle toggle of side nav */
  const toggleSideNav = () => {
    if (window.screen.width < 800) {
      setSideNav(!sideNav)
    }
  }

  /* Toggle light/dark mode */
  const handleDarkModeBtn = (event: React.MouseEvent) => {
    if (isDarkMode) {
      dispatch(setLightMode())
    } else {
      dispatch(setDarkMode())
    }
  }

  const loggedIn = (
    <Container maxWidth='xl' className={classes.linkContainer}>
      <Link to='/dashboard' className={classes.linkStyle}>
        <Button color='inherit' className={classes.navLink}>
          Dashboard
        </Button>
      </Link>
      <Button color='inherit' className={classes.navLink} onClick={() => dispatch(userLogout())}>
        Logout
      </Button>
      <Button className={classes.darkModeBtn} onClick={handleDarkModeBtn}>
        {isDarkMode ? <Brightness7Icon /> : <NightsStayIcon style={{ color: "white" }} />}
      </Button>
    </Container>
  )

  const guestUser = (
    <Container maxWidth='xl' className={classes.linkContainer}>
      <Link to='/login' className={classes.linkStyle}>
        <Button color='inherit' className={classes.navLink}>
          Login
        </Button>
      </Link>
      <Button className={classes.darkModeBtn} onClick={handleDarkModeBtn}>
        {isDarkMode ? <Brightness7Icon /> : <NightsStayIcon style={{ color: "white" }} />}
      </Button>
    </Container>
  )

  const getNavLinks = () => {
    const auth = authUser.auth

    return !auth.isLoading && auth.isAuthenticated ? loggedIn : guestUser
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            onClick={() => toggleSideNav()}
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6'>
            <Link to='/' className={classes.linkStyle}>
              <div className={classes.logo}>
                <span style={{ color: theme.palette.primary.main }}>Open</span>
                <span style={{ color: theme.palette.secondary.main }}>Grow</span>
              </div>
            </Link>
          </Typography>
          {getNavLinks()}
        </Toolbar>
      </AppBar>

      {/* Side nav drawer to be toggles */}
      <NavDrawer isOpen={sideNav} onOpen={() => setSideNav(true)} onClose={() => setSideNav(false)} />
    </div>
  )
}
