import React from 'react'

import { Grid, Typography, Paper } from '@material-ui/core/'

import { useTheme } from '@material-ui/core/styles'

import StepsCarousel from './StepsCarousel'

export default function HowItWorks() {
	const theme = useTheme()

	return (
		<Paper className="how-it-works-card" style={{ backgroundColor: theme.palette.primary.light }}>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12}>
					<Typography component="div" align="center" variant="h4">
						<h4 className="card-title">How it Works</h4>
					</Typography>
					<StepsCarousel />
				</Grid>
			</Grid>
		</Paper>
	)
}
