import React from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Paper, Typography } from '@material-ui/core/'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		noPlantDataContainer: {
			fontFamily: "'Mulish', sans-serif",
			padding: '15px 22px',
			width: '90%',
			maxWidth: '600px',
			backgroundColor: '#ff7961',
		},
	})
)

export default function NoPlantData() {
	const classes = useStyles()

	return (
		<Paper className={classes.noPlantDataContainer}>
			<Typography variant="h5" gutterBottom>
				No plants have been added to your account yet!
			</Typography>
			<Typography variant="body1">
				Click 'Add Plant' above and enter the ID of a plant to get started.
			</Typography>
		</Paper>
	)
}
