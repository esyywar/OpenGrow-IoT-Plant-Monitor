import React, { useEffect } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadCtrlData } from '../../actions/plantControl'

import { useTheme } from '@material-ui/core'
import { Grid, Paper, Button } from '@material-ui/core/'

import Spinner from '../util/Spinner'

export default function PlantCtrlSettings() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const userPlantsState = useTypedSelector((state) => state.userPlantsState)

	const plantCtrl = useTypedSelector((state) => state.plantControlState)

	return (
		<Grid container direction="column" justify="flex-start" alignItems="flex-start">
			{userPlantsState.isLoading ? (
				<Spinner />
			) : (
				<Paper style={{ backgroundColor: theme.palette.secondary.light }}>
					<Grid item xs={12} lg={6}>
						{plantCtrl.control.soilMoisture.setpoint}
					</Grid>
					<Grid item xs={12} lg={6}>
						{plantCtrl.control.soilMoisture.tolerance}
					</Grid>
				</Paper>
			)}
		</Grid>
	)
}
