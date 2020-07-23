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
		linkContainerStyle: {
			display: 'flexbox',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
		logoBgStyle: {
			backgroundColor: 'whitesmoke',
			padding: '5px 8px',
			borderRadius: '35px',
		},
		logoHalfOne: {
			color: theme.palette.primary.main,
			fontWeight: 500,
		},
		logoHalfTwo: {
			color: theme.palette.secondary.main,
			fontWeight: 500,
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
						<Link to="/" className="nav-link">
							<div className={classes.logoBgStyle}>
								<span className={classes.logoHalfOne}>Otto</span>
								<span className={classes.logoHalfTwo}>Grow</span>
							</div>
						</Link>
					</Typography>
					<Container maxWidth="xl" className={classes.linkContainerStyle}>
						<Button color="inherit" style={{ float: 'right' }}>
							<Link to="/login" className="nav-link">
								Login
							</Link>
						</Button>
					</Container>
				</Toolbar>
			</AppBar>
		</div>
	)
}
