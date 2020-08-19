import React, { useEffect, Fragment } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'

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
			x: date,
			y: measurement,
		}
	})

	/* Map light data for plotting */
	const lightData = plantData.data.lightLevel.map(({ measurement, date }) => {
		return {
			x: date,
			y: measurement,
		}
	})

	/* Date format specifier */
	let dateFormat = timeFormat('%m-%d-%Y-%H-%M-%S-%L')

	return (
		<Grid container className="plant-data-plot-container" spacing={4}>
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 && plantData.data.lightLevel.length > 0 ? (
				<Fragment>
					<LinePlot dataId="Soil Moisture" data={soilData} />
					<LinePlot dataId="Light Level" data={lightData} />
					{console.log(dateFormat(plantData.data.soilMoisture[0].date))}
				</Fragment>
			) : (
				'This plant has not collected any data yet!'
			)}
		</Grid>
	)
}
