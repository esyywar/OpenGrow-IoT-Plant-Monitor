import React, { useEffect, useMemo } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { timeFormat } from 'd3-time-format'

import LinePlot from './LinePlot'

import { Grid, Container } from '@material-ui/core/'

import Spinner from '../util/Spinner'

/* Date format specifier */
const dateFormat = timeFormat('%m-%d-%Y-%H-%M-%S')

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
	const soilData = useMemo(
		() =>
			plantData.data.soilMoisture.map(({ measurement, date }) => ({
				x: dateFormat(date),
				y: measurement,
			})),
		[plantData.data.soilMoisture]
	)

	/* Map light data for plotting */
	const lightData = useMemo(
		() =>
			plantData.data.lightLevel.map(({ measurement, date }) => ({
				x: dateFormat(date),
				y: measurement,
			})),
		[plantData.data.lightLevel]
	)

	return (
		<Container maxWidth={false} className="plant-data-plot-container">
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 &&
			  plantData.data.lightLevel.length > 0 &&
			  soilData ? (
				<Grid container spacing={4} style={{ padding: '25px 0' }}>
					<LinePlot
						title="Soil Moisture"
						yTitle="Soil Moisture"
						plotData={[{ id: 'Soil Moisture', data: soilData }]}
					/>
					<LinePlot
						title="Light Availability"
						yTitle="Light Level"
						plotData={[{ id: 'Light Level', data: lightData }]}
					/>
				</Grid>
			) : (
				'This plant has not collected any data yet!'
			)}
		</Container>
	)
}
