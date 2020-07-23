import React from 'react'

import { Link } from 'react-router-dom'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, IconButton, Container } from '@material-ui/core/'
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
	const theme = useTheme()
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6">
						<Link to="/" className="link-style">
							<div className="logo">
								<span style={{ color: theme.palette.primary.main }}>Otto</span>
								<span style={{ color: theme.palette.secondary.main }}>Grow</span>
							</div>
						</Link>
					</Typography>
					<Container maxWidth="xl" className="link-container">
						<Link to="/login" className="link-style">
							<Button color="inherit" className="nav-link">
								Login
							</Button>
						</Link>
					</Container>
				</Toolbar>
			</AppBar>
		</div>
	)
}
