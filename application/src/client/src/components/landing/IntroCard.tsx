import React from 'react'

import { Grid, Typography, Paper } from '@material-ui/core/'

import { makeStyles, createStyles, useTheme, Theme } from '@material-ui/core/styles'

import WbSunnyIcon from '@material-ui/icons/WbSunny'
import WifiIcon from '@material-ui/icons/Wifi'
import OpacityIcon from '@material-ui/icons/Opacity'
import ComputerIcon from '@material-ui/icons/Computer'

import '../../css/landing.css'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		cardInfoText: {
			fontFamily: "'Mulish', sans-seif",
			fontSize: '19px',
			lineHeight: '35px',
			textAlign: 'center',
			padding: '20px 5px',
			color: theme.palette.text.primary,
		},
	})
)

export default function IntroCard() {
	const theme = useTheme()

	const classes = useStyles()

	const pottedPlantImg = require('../../media/potted_plant.jpg')

	return (
		<Paper className="intro-card" style={{ backgroundColor: theme.palette.secondary.light }}>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12}>
					<Typography component="div" align="center" variant="h4">
						<h4 className="card-title">Data Driven Care For Your Plant!</h4>
					</Typography>
				</Grid>

				<Grid item container spacing={6} direction="row" alignItems="center" justify="center">
					<Grid item xs={11} lg={5} style={{ overflow: 'hidden' }}>
						<img className="plant-image" alt="potted-plant" src={pottedPlantImg} />
					</Grid>
					<Grid item xs={11} lg={6}>
						<Paper
							className="card-info-container"
							style={{ backgroundColor: theme.palette.background.paper }}
						>
							<Typography variant="body1" className={classes.cardInfoText}>
								Ottogrow provides you with the information to make sure your plant is thriving!
							</Typography>
							<Typography variant="body1" className={classes.cardInfoText}>
								We track precise data quantifying soil moisture and light availability for your
								plant so that you can make informed decisions.
							</Typography>
							<Typography variant="body1" className={classes.cardInfoText}>
								Set up threshold limits so that your plant is automatically taken care of 24/7! View
								your plant's health indicators at anytime and make adjustments in real-time.
							</Typography>
						</Paper>
					</Grid>
				</Grid>

				<Grid
					item
					container
					direction="row"
					alignItems="center"
					justify="center"
					className="icons-container"
				>
					<Grid item xs={3}>
						<OpacityIcon className="icons-style water-icon" />
					</Grid>
					<Grid item xs={3}>
						<WbSunnyIcon className="icons-style sun-icon" />
					</Grid>
					<Grid item xs={3}>
						<WifiIcon className="icons-style wifi-icon" />
					</Grid>
					<Grid item xs={3}>
						<ComputerIcon className="icons-style computer-icon" />
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	)
}
