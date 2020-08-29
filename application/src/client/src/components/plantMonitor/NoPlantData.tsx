import React from 'react'

import { useTypedSelector } from '../../reducers'

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

	const activePlant = useTypedSelector((state) => state.activePlantState.activePlant)

	return (
		<Paper className={classes.noPlantDataContainer}>
			<Typography
				variant="h5"
				gutterBottom
			>{`${activePlant.name} has not collected any data yet!`}</Typography>
			<Typography variant="body1">
				Make sure your plant is properly powered and connected.
			</Typography>
		</Paper>
	)
}
