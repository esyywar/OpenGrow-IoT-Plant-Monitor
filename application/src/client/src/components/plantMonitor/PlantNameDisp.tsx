import React from 'react'

import { useTypedSelector } from '../../reducers'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Grid, Paper, useTheme } from '@material-ui/core/'

import Spinner from '../util/Spinner'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		plantMonWelcome: {
			fontSize: 15,
			padding: 18,
		},
		activePlantName: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: 35,
		},
	})
)

export default function PlantNameDisp() {
	const theme = useTheme()

	const classes = useStyles()

	const activePlantState = useTypedSelector((state) => state.activePlantState)

	return (
		<Grid container>
			{activePlantState.isLoading || activePlantState.activePlant.name === '' ? (
				<Spinner />
			) : (
				<Grid item xs={12} lg={6}>
					<Paper
						elevation={8}
						style={{ backgroundColor: theme.palette.secondary.light }}
						className={classes.plantMonWelcome}
					>
						<h4 className={classes.activePlantName}>{activePlantState.activePlant.name}</h4>
					</Paper>
				</Grid>
			)}
		</Grid>
	)
}
