import React from 'react'

import { useTypedSelector } from '../../reducers'

import { useTheme } from '@material-ui/core'
import { Grid, Paper } from '@material-ui/core/'

import Spinner from '../util/Spinner'

export default function PlantNameDisp() {
	const theme = useTheme()

	const userPlantsState = useTypedSelector((state) => state.userPlantsState)

	/* Filter to get active plant */
	const activePlant = userPlantsState.userPlants.filter(({ isActive }) => isActive)[0]

	return (
		<Grid container>
			{userPlantsState.isLoading || activePlant === null ? (
				<Spinner />
			) : (
				<Grid item xs={12} lg={6}>
					<Paper
						elevation={8}
						style={{ backgroundColor: theme.palette.primary.light }}
						className="plant-monitor-welcome"
					>
						<h4 className="active-plant-name">{activePlant.name}</h4>
					</Paper>
				</Grid>
			)}
		</Grid>
	)
}
