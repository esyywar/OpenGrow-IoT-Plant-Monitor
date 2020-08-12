import React from 'react'

import { useTypedSelector } from '../../reducers'

import { useTheme } from '@material-ui/core'
import { Grid, Paper } from '@material-ui/core/'

import Spinner from '../util/Spinner'

export default function PlantNameDisp() {
	const theme = useTheme()

	const activePlantState = useTypedSelector((state) => state.activePlantState)

	return (
		<Grid container>
			{activePlantState.isLoading || activePlantState.activePlant.name === '' ? (
				<Spinner />
			) : (
				<Grid item xs={12} lg={6}>
					<Paper
						elevation={8}
						style={{ backgroundColor: theme.palette.primary.light }}
						className="plant-monitor-welcome"
					>
						<h4 className="active-plant-name">{activePlantState.activePlant.name}</h4>
					</Paper>
				</Grid>
			)}
		</Grid>
	)
}
