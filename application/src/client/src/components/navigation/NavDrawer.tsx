import React, { Fragment, useEffect } from "react"

import { Link } from "react-router-dom"

import PropTypes, { InferProps } from "prop-types"

import { useTypedSelector } from "../../reducers"
import { useDispatch } from "react-redux"
import { userLogout } from "../../actions/auth"
import { loadUserPlants } from "../../actions/userPlants"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { SwipeableDrawer, List, ListItem, ListItemText, ListItemIcon, Divider } from "@material-ui/core"

import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import HomeIcon from "@material-ui/icons/Home"
import SettingsRemoteIcon from "@material-ui/icons/SettingsRemote"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideNavRoot: {
      width: "250px",
    },
    linkStyle: {
      textDecoration: "none",
      color: theme.palette.text.primary,
    },
  })
)

export default function NavDrawer({ isOpen, onOpen, onClose }: InferProps<typeof NavDrawer.propTypes>) {
  const dispatch = useDispatch()

  const classes = useStyles()

  /* Auth state to choose which nav menu to show */
  const authUser = useTypedSelector((state) => state.authState)

  const userPlants = useTypedSelector((state) => state.userPlantsState.userPlants)

  const isLoggedIn = !authUser.auth.isLoading && authUser.auth.isAuthenticated

  /* If user logged in and no plants, try reloading state in case it has not been loaded yet */
  useEffect(() => {
    if (isLoggedIn && userPlants.length < 1) {
      dispatch(loadUserPlants())
    }
    // eslint-disable-next-line
  }, [dispatch, isLoggedIn])

  const loggedInList = (
    <Fragment>
      <Link to='/dashboard' className={classes.linkStyle} onClick={() => onClose()}>
        <ListItem>
          <ListItemIcon>
            <SettingsRemoteIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
      </Link>
    </Fragment>
  )

  const handleLogout = (event: React.MouseEvent) => {
    dispatch(userLogout())
    onClose()
  }

  return (
    <SwipeableDrawer
      anchor='left'
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      classes={{
        paper: classes.sideNavRoot,
      }}
    >
      <List>
        {isLoggedIn && (
          <Fragment>
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={`${authUser.auth.username}`} secondary={`${userPlants.length} plants tracked!`} />
            </ListItem>
            <Divider />
          </Fragment>
        )}
        <Link to='/' className={classes.linkStyle} onClick={() => onClose()}>
          <ListItem>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
        </Link>
        {isLoggedIn && loggedInList}
      </List>
      <Divider />
      <List>
        {isLoggedIn ? (
          <ListItem onClick={handleLogout}>
            <ListItemIcon>
              <MeetingRoomIcon />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        ) : (
          <Link to='/login' className={classes.linkStyle} onClick={() => onClose()}>
            <ListItem>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary='Login' />
            </ListItem>
          </Link>
        )}
      </List>
    </SwipeableDrawer>
  )
}

NavDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
