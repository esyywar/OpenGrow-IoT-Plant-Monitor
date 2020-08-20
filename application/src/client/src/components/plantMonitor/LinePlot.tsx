import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { ResponsiveLine } from '@nivo/line'

import { timeFormat } from 'd3-time-format'

import RefreshIcon from '@material-ui/icons/Refresh'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useTheme, Theme, Grid, Typography, Paper, Button } from '@material-ui/core/'

import TimeScaleMenu from './TimeScaleMenu'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		titleRoot: {
			fontFamily: "'Mulish', sans-seif",
			marginTop: 10,
			fontSize: 30,
			fontWeight: 600,
		},
		chartRoot: {
			width: '100%',
			height: 500,
			color: theme.palette.text.primary,
		},
		actionButton: {
			marginRight: 25,
		},
		toolTip: {
			border: '2px solid ' + theme.palette.secondary.main,
			borderRadius: theme.spacing(2),
			padding: theme.spacing(2),
			fontFamily: "'Mulish', sans-serif",
			fontSize: 14,
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text.primary,
			fontWeight: 'bold',
			boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
			marginBottom: theme.spacing(2),
		},
	})
)

export enum TimeScaleEnum {
	Hours = 'Hours',
	Days = 'Days',
	Weeks = 'Weeks',
}

/* Date format specifier */
const dateFormat = timeFormat('%b %d, %Y %H:%M')

export default function LinePlot({
	title,
	yTitle,
	plotData,
}: InferProps<typeof LinePlot.propTypes>) {
	const [isHover, setHover] = useState(false)

	/* Time scale (chosen from menu in TimeScaleMenu component) */
	const [timeScale, setTimeScale] = useState<TimeScaleEnum>(TimeScaleEnum.Hours)

	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

	/* If time scale updated, reflect change in local state */
	const updateTimeScale = (newTimeScale: TimeScaleEnum) => {
		if (timeScale !== newTimeScale) {
			setTimeScale(newTimeScale)
		}
	}

	const plantId = useTypedSelector((state) => state.activePlantState.activePlant.plantId)

	/* Get fresh data from database on refresh */
	const refreshData = () => {
		dispatch(loadPlantData(plantId))
	}

	const tickFromScale = () => {
		switch (timeScale) {
			case TimeScaleEnum.Hours:
				return 'every 1 hour'
			case TimeScaleEnum.Days:
				return 'every 1 day'
			case TimeScaleEnum.Weeks:
				return 'every 7 days'
			default:
				return 'every 1 hour'
		}
	}

	return (
		<Grid item container xs={12} direction="column" alignItems="center" justify="flex-start">
			<Paper
				style={{
					width: '100%',
					backgroundColor: theme.palette.background.paper,
					borderWidth: '4px',
					borderStyle: 'solid',
					borderColor: isHover ? theme.palette.secondary.light : theme.palette.secondary.main,
					padding: '10px',
				}}
			>
				<Grid item xs={12}>
					<Typography align="center" variant="h5" className={classes.titleRoot}>
						{title}
					</Typography>
				</Grid>

				<Grid
					item
					container
					xs={12}
					direction="row"
					alignItems="center"
					justify="flex-start"
					style={{ margin: '10px 20px' }}
				>
					<Button
						startIcon={<RefreshIcon />}
						color="secondary"
						variant="contained"
						className={classes.actionButton}
						onClick={refreshData}
					>
						{' '}
						<Typography align="center" variant="body2">
							Refresh Data
						</Typography>
					</Button>

					<TimeScaleMenu currTimeScale={timeScale} onScaleChange={updateTimeScale} />
				</Grid>

				<Grid item xs={12} className={classes.chartRoot}>
					<ResponsiveLine
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						data={plotData}
						lineWidth={4}
						pointSize={10}
						curve={'monotoneX'}
						enableGridY={true}
						enableGridX={true}
						colors={isHover ? theme.palette.text.primary : theme.palette.text.secondary}
						margin={{ top: 10, right: 110, bottom: 100, left: 100 }}
						xScale={{ format: '%m-%d-%Y-%H-%M-%S', type: 'time' }}
						xFormat="time:%m-%d-%Y-%H-%M-%S"
						yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
						axisTop={null}
						axisRight={null}
						axisBottom={{
							orient: 'bottom',
							format: '%b-%d %H:%M',
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							tickValues: tickFromScale(),
							legend: 'Time',
							legendOffset: 50,
							legendPosition: 'middle',
						}}
						axisLeft={{
							orient: 'left',
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: yTitle,
							legendOffset: -70,
							legendPosition: 'middle',
						}}
						useMesh={true}
						theme={{
							grid: {
								line: {
									stroke: theme.palette.text.primary,
								},
							},
							axis: {
								legend: {
									text: {
										fill: theme.palette.text.primary,
										fontSize: 20,
									},
								},
								ticks: {
									text: {
										fill: theme.palette.text.primary,
										fontSize: 14,
									},
									line: {
										stroke: theme.palette.text.primary,
										strokeWidth: 1,
									},
								},
								domain: {
									line: {
										stroke: theme.palette.text.primary,
										strokeWidth: 1,
									},
								},
							},
							crosshair: {
								line: {
									stroke: theme.palette.text.primary,
									strokeWidth: 1,
									strokeOpacity: 0.35,
								},
							},
						}}
						tooltip={({ point }) => {
							return (
								<div className={classes.toolTip}>
									<p>{dateFormat(new Date(point.data.x))}</p>
									<p>{`${point.id.slice(0, point.id.indexOf('.'))}: ${point.data.y}`}</p>
								</div>
							)
						}}
					/>
				</Grid>
			</Paper>
		</Grid>
	)
}

LinePlot.propTypes = {
	title: PropTypes.string.isRequired,
	yTitle: PropTypes.string.isRequired,
	plotData: [
		{
			id: PropTypes.string.isRequired,
			data: {
				x: PropTypes.instanceOf(Date).isRequired,
				y: PropTypes.number.isRequired,
			},
		},
	],
}
