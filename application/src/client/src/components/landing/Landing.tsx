import React from 'react'

import { Grid } from '@material-ui/core/'

import IntroCard from './IntroCard'

export default function Landing() {
	return (
		<Grid
			container
			style={{ marginTop: '45px' }}
			direction="row"
			alignItems="center"
			justify="space-evenly"
		>
			<Grid item container xs={12} lg={7} direction="column" alignItems="center" justify="center">
				<IntroCard />
			</Grid>
			<Grid item xs={12} sm={4}></Grid>
		</Grid>
	)
}
