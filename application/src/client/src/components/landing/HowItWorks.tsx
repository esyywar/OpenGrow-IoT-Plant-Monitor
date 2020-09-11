import React from 'react'

import { Grid, Typography, Paper } from '@material-ui/core/'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'

import StepsCarousel from './StepsCarousel'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		howItWorks: {
			padding: '30px',
			fontFamily: "'Mulish', sans-serif",
			marginBottom: theme.spacing(4),
			[theme.breakpoints.down('sm')]: {
				marginLeft: '15px',
				marginRight: '15px',
				maxWidth: '90%',
			},
			[theme.breakpoints.up('md')]: {
				width: '100%',
			},
		},
		cardTitle: {
			fontFamily: "'Mulish', sans-serif",
			marginBottom: '16px',
			[theme.breakpoints.down('sm')]: {
				fontSize: '28px',
			},
			[theme.breakpoints.up('md')]: {
				fontSize: '30px',
			},
			[theme.breakpoints.up('lg')]: {
				fontSize: '34px',
			},
		},
		cardCaption: {
			[theme.breakpoints.down('sm')]: {
				fontSize: '17px',
				lineHeight: '30px',
			},
			[theme.breakpoints.up('md')]: {
				fontSize: '19px',
				lineHeight: '30px',
			},
			[theme.breakpoints.up('lg')]: {
				fontSize: '20px',
			},
			fontFamily: "'Mulish', sans-serif",
			borderRadius: '35px',
			margin: '20px 0',
			padding: '14px',
		},
	})
)

export default function HowItWorks() {
	const theme = useTheme()

	const classes = useStyles()

	return (
		<Paper className={classes.howItWorks} style={{ backgroundColor: theme.palette.primary.light }}>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12}>
					<Typography component="div" align="center" variant="h4">
						<h4 className={classes.cardTitle}>How It Works</h4>
						<Paper style={{ backgroundColor: theme.palette.background.paper }}>
							<p className={classes.cardCaption}>
								OpenGrow is easy to set-up. Follow the 5 steps below and enjoy the convenience of
								being able to monitor and take care of your plants from anywhere at anytime!
							</p>
						</Paper>
					</Typography>
					<StepsCarousel />
				</Grid>
			</Grid>
		</Paper>
	)
}
