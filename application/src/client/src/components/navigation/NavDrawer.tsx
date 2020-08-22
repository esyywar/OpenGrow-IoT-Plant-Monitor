import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import PropTypes, { InferProps } from 'prop-types'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { userLogout } from '../../actions/auth'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import {
	SwipeableDrawer,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Divider,
} from '@material-ui/core'

import HomeIcon from '@material-ui/icons/Home'
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		sideNav: {
			width: '80vw',
		},
		linkStyle: {
			textDecoration: 'none',
			color: theme.palette.text.primary,
		},
	})
)

export default function NavDrawer({
	isOpen,
	onOpen,
	onClose,
}: InferProps<typeof NavDrawer.propTypes>) {
	const dispatch = useDispatch()

	const classes = useStyles()

	/* Auth state to choose which nav menu to show */
	const authUser = useTypedSelector((state) => state.authState)

	const isLoggedIn = !authUser.auth.isLoading && authUser.auth.isAuthenticated

	const loggedInList = (
		<Fragment>
			<ListItem>
				<Link to="/dashboard" className={classes.linkStyle} onClick={() => onClose()}>
					<ListItemIcon>
						<SettingsRemoteIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</Link>
			</ListItem>
		</Fragment>
	)

	const handleLogout = (event: React.MouseEvent) => {
		dispatch(userLogout())
		onClose()
	}

	return (
		<SwipeableDrawer
			anchor="left"
			open={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			className={classes.sideNav}
		>
			<List>
				<ListItem>
					<Link to="/" className={classes.linkStyle} onClick={() => onClose()}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</Link>
				</ListItem>
				{isLoggedIn && loggedInList}
			</List>
			<Divider />
			<List>
				{isLoggedIn ? (
					<ListItem onClick={handleLogout}>
						<ListItemIcon>
							<MeetingRoomIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem>
				) : (
					<ListItem>
						<Link to="/login" className={classes.linkStyle}>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</Link>
					</ListItem>
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
