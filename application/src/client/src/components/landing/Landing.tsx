import React from 'react'

import { Grid } from '@material-ui/core/'

import IntroCard from './IntroCard'
import HowItWorks from './HowItWorks'

export default function Landing() {
	return (
		<Grid
			container
			className="landing-container"
			direction="row"
			alignItems="center"
			justify="space-evenly"
		>
			<Grid item container xs={12} lg={7} direction="column" alignItems="center" justify="center">
				<IntroCard />
			</Grid>
			<Grid item container xs={12} lg={4} direction="column" alignItems="center" justify="center">
				<HowItWorks />
			</Grid>
		</Grid>
	)
}
