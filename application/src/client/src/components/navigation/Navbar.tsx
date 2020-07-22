import React from 'react'

import { Link } from 'react-router-dom'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core/'
import MenuIcon from '@material-ui/icons/Menu'

import '../../css/navbar.css'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
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
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Ottogrow
					</Typography>
					<Button color="inherit">
						<Link to="/login" className="nav-link">
							Login
						</Link>
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	)
}
