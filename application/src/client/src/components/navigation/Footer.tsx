import React from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Container, Grid, Typography } from '@material-ui/core/'

import GitHubIcon from '@material-ui/icons/GitHub'
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast'

import LogoBtn from '../util/LogoBtn'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		footerContainer: {
			margin: 0,
			padding: 0,
			position: 'absolute',
			bottom: '0',
			boxShadow: '0 4px 14px 4px rgba(0, 0, 0, 0.9)',
			paddingTop: theme.spacing(1),
			backgroundColor: theme.palette.primary.main,
			minHeight: '4rem',
		},
		footerGrid: {
			height: '100%',
		},
		footerTextContainer: {
			margin: 0,
			color: 'white',
			maxWidth: '300px',
			textAlign: 'center',
			padding: '7px 0',
		},
		footerText: {
			fontSize: '14px',
		},
		openSourceTag: {
			[theme.breakpoints.down('sm')]: {
				margin: '6px auto',
			},
			[theme.breakpoints.up('md')]: {
				justifySelf: 'flex-start',
				marginLeft: theme.spacing(4),
			},
		},
		pizzaTag: {
			[theme.breakpoints.down('sm')]: {
				margin: '6px auto',
			},
			[theme.breakpoints.up('md')]: {
				justifySelf: 'flex-end',
				float: 'right',
				marginRight: theme.spacing(4),
			},
		},
		hyperlinkStyle: {
			textDecoration: 'none',
			color: 'white',
		},
	})
)

export default function Footer() {
	const classes = useStyles()

	return (
		<Container maxWidth={false} className={classes.footerContainer}>
			<Grid
				className={classes.footerGrid}
				container
				direction="row"
				alignItems="center"
				justify="space-around"
			>
				<Grid item xs={12} md={3}>
					<div className={`${classes.footerTextContainer} ${classes.openSourceTag}`}>
						<Typography className={classes.footerText}>
							OpenGrow is proudly an open-source project!{'  '}
							<a
								href="https://github.com/esyywar/OpenGrow-IoT-Plant-Monitor"
								target="_blank"
								rel="noopener noreferrer"
								className={classes.hyperlinkStyle}
							>
								<GitHubIcon />
							</a>
						</Typography>
					</div>
				</Grid>
				<Grid item xs={12} md={6}>
					<Grid container justify="center">
						<LogoBtn />
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<div className={`${classes.footerTextContainer} ${classes.pizzaTag}`}>
						<Typography className={classes.footerText}>
							You can support OpenGrow and future projects by{' '}
							<a
								href="https://www.buymeacoffee.com/esyywar"
								target="_blank"
								rel="noopener noreferrer"
								className={classes.hyperlinkStyle}
							>
								buying me a coffee!{' '}
							</a>
							<FreeBreakfastIcon />
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Container>
	)
}
