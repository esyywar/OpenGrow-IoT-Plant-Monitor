import React, { useEffect, Fragment } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { ResponsiveLine } from '@nivo/line'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'

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

	/* Get plant data */
	const plantData = useTypedSelector((state) => state.plantDataState)

	/* Common properties for nivo graph */
	const commonProperties = {
		width: 900,
		height: 400,
		margin: { top: 20, right: 20, bottom: 60, left: 80 },
		animate: true,
		enableSlices: 'x',
	}

	const soilData = plantData.data.soilMoisture.map(({ measurement, date }) => {
		return {
			x: measurement,
			y: date.getMinutes(),
		}
	})

	console.log(soilData)

	/* Plot test */
	const testPlot = () => {
		return (
			<Fragment>
				<h4>Tada - a graph appears!</h4>
				<ResponsiveLine
					data={[{ id: 'Soil Moisture', data: soilData }]}
					margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
					xScale={{ type: 'point' }}
					yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						orient: 'bottom',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'transportation',
						legendOffset: 36,
						legendPosition: 'middle',
					}}
					axisLeft={{
						orient: 'left',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'count',
						legendOffset: -40,
						legendPosition: 'middle',
					}}
					colors={{ scheme: 'nivo' }}
					pointSize={10}
					pointColor={{ theme: 'background' }}
					pointBorderWidth={2}
					pointBorderColor={{ from: 'serieColor' }}
					pointLabel="y"
					pointLabelYOffset={-12}
					useMesh={true}
					legends={[
						{
							anchor: 'bottom-right',
							direction: 'column',
							justify: false,
							translateX: 100,
							translateY: 0,
							itemsSpacing: 0,
							itemDirection: 'left-to-right',
							itemWidth: 80,
							itemHeight: 20,
							itemOpacity: 0.75,
							symbolSize: 12,
							symbolShape: 'circle',
							symbolBorderColor: 'rgba(0, 0, 255, .5)',
							effects: [
								{
									on: 'hover',
									style: {
										itemBackground: 'rgba(0, 0, 255, .03)',
										itemOpacity: 1,
									},
								},
							],
						},
					]}
				/>
			</Fragment>
		)
	}

	return (
		<Grid className="plant-data-plot">
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 && plantData.data.lightLevel.length > 0 ? (
				testPlot()
			) : (
				'This plant has not collected any data yet!'
			)}
		</Grid>
	)
}
