import React, { useEffect, Fragment } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { ResponsiveLine } from '@nivo/line'
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

	const soilData = plantData.data.soilMoisture.map(({ measurement, date }) => {
		return {
			x: date.getMinutes(),
			y: measurement,
		}
	})

	const lightData = plantData.data.lightLevel.map(({ measurement, date }) => {
		return {
			x: date.getMinutes(),
			y: measurement,
		}
	})

	return (
		<Grid container className="plant-data-plot-container">
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 && plantData.data.lightLevel.length > 0 ? (
				<Fragment>
					<LinePlot data={soilData} />
					<LinePlot data={lightData} />
				</Fragment>
			) : (
				'This plant has not collected any data yet!'
			)}
		</Grid>
	)
}
