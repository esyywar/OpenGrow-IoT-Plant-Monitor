import React, { useEffect, useMemo } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import LinePlot from './LinePlot'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Grid, Container } from '@material-ui/core/'

import NoPlantData from './NoPlantData'
import Spinner from '../util/Spinner'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		dataPlotContainer: {
			margin: '0',
			padding: '0',
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(2),
			},
			[theme.breakpoints.up('md')]: {
				marginTop: theme.spacing(3),
			},
		},
	})
)

export default function PlantDataPlot() {
	const dispatch = useDispatch()

	const classes = useStyles()

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
				x: date,
				y: measurement,
			})),
		[plantData.data.soilMoisture]
	)

	/* Map light data for plotting */
	const lightData = useMemo(
		() =>
			plantData.data.lightLevel.map(({ measurement, date }) => ({
				x: date,
				y: measurement,
			})),
		[plantData.data.lightLevel]
	)

	return (
		<Container maxWidth={false} className={classes.dataPlotContainer}>
			{plantData.isLoading ? (
				<Spinner />
			) : plantData.data.soilMoisture.length > 0 &&
			  plantData.data.lightLevel.length > 0 &&
			  soilData &&
			  lightData ? (
				<Grid container spacing={6} style={{ padding: '25px 0' }}>
					<LinePlot
						title="Soil Moisture"
						yTitle="Soil Moisture"
						plotData={{ id: 'Soil Moisture', data: soilData }}
					/>
					<LinePlot
						title="Light Availability"
						yTitle="Light Level"
						plotData={{ id: 'Light Level', data: lightData }}
					/>
				</Grid>
			) : (
				<NoPlantData />
			)}
		</Container>
	)
}
