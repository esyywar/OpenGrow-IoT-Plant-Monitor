import React, { useEffect } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { useTheme } from '@material-ui/core'
import { Grid, Paper } from '@material-ui/core/'

import Spinner from '../util/Spinner'

export default function PlantDataPlot() {
	const dispatch = useDispatch()

	const activePlant = useTypedSelector((state) => state.activePlantState.activePlant)

	/* Load plant data on render */
	useEffect(() => {
		if (activePlant.plantId) {
			dispatch(loadPlantData(activePlant.plantId))
		}
	}, [dispatch, activePlant])

	return <Grid className="plant-data-plot">This is the plant data boi</Grid>
}