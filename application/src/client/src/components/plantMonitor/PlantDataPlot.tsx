import React, { useEffect, Fragment } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import LinePlot from './LinePlot'

import { Grid } from '@material-ui/core/'

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

	/* Get plant data */
	const plantData = useTypedSelector((state) => state.plantDataState)

	/* Map soil data for plotting */
	const soilData = plantData.data.soilMoisture.map(({ measurement, date }) => {
		return {
			x: date.getMinutes(),
			y: measurement,
		}
	})

	/* Map light data for plotting */
	const lightData = plantData.data.lightLevel.map(({ measurement, date }) => {
		return {
			x: date.getMinutes(),
			y: measurement,
		}
	})

	return (
		<Grid
			container
			className="plant-data-plot-container"
			spacing={8}
			direction="row"
			alignItems="center"
			justify="center"
		>
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 && plantData.data.lightLevel.length > 0 ? (
				<Fragment>
					<LinePlot dataId="Soil Moisture" data={soilData} />
					<LinePlot dataId="Light Level" data={lightData} />
				</Fragment>
			) : (
				'This plant has not collected any data yet!'
			)}
		</Grid>
	)
}
