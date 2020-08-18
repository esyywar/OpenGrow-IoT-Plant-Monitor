import React, { useEffect } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadCtrlData } from '../../actions/plantControl'

import { useTheme } from '@material-ui/core'
import { Grid, Paper, Button } from '@material-ui/core/'

import EditIcon from '@material-ui/icons/Edit'

import Spinner from '../util/Spinner'

export default function PlantCtrlSettings() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const activePlant = useTypedSelector((state) => state.activePlantState.activePlant)

	const plantCtrlState = useTypedSelector((state) => state.plantControlState)

	/* Load plant's control data */
	useEffect(() => {
		if (activePlant.plantId !== '') {
			dispatch(loadCtrlData(activePlant.plantId))
		}
	}, [dispatch, activePlant])

	return (
		<Grid
			container
			direction="column"
			justify="flex-start"
			alignItems="flex-start"
			className="plant-ctrl-settings"
		>
			{plantCtrlState.isLoading ? (
				<Spinner />
			) : (
				<Paper
					style={{ backgroundColor: theme.palette.primary.light }}
					className="plant-ctrl-container"
				>
					<h3 className="soil-mois-title">Soil Moisture Controls</h3>
					<Grid item container xs={12} spacing={5} className="ctrl-setting-container">
						<Grid item xs={6} lg={5} className="ctrl-metric">
							<h4 className="ctrl-setting-text">Setpoint:</h4>
						</Grid>
						<Grid
							item
							xs={2}
							lg={2}
							className="ctrl-value"
							style={{ backgroundColor: theme.palette.background.default }}
						>
							<h4 className="ctrl-setting-text">{plantCtrlState.control.soilMoisture.setpoint}</h4>
						</Grid>
						<Grid item xs={1} className="ctrl-edit-btn">
							<Button>
								<EditIcon />
							</Button>
						</Grid>
					</Grid>
					<Grid item container xs={12} spacing={5} className="ctrl-setting-container">
						<Grid item xs={6} lg={5} className="ctrl-metric">
							<h4 className="ctrl-setting-text">Tolerance:</h4>
						</Grid>
						<Grid
							item
							xs={2}
							lg={2}
							className="ctrl-value"
							style={{ backgroundColor: theme.palette.background.default }}
						>
							<h4 className="ctrl-setting-text">{plantCtrlState.control.soilMoisture.tolerance}</h4>
						</Grid>
						<Grid item xs={1} className="ctrl-edit-btn">
							<Button>
								<EditIcon />
							</Button>
						</Grid>
					</Grid>
				</Paper>
			)}
		</Grid>
	)
}
