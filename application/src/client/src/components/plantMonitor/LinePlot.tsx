import React, { useState, useEffect } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadPlantData } from '../../actions/plantData'

import { ResponsiveLine } from '@nivo/line'

import { timeFormat } from 'd3-time-format'

import RefreshIcon from '@material-ui/icons/Refresh'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useTheme, Theme, Grid, Typography, Paper, Button } from '@material-ui/core/'

import TimeScaleMenu from './TimeScaleMenu'

interface PlotProps {
	title: string
	yTitle: string
	plotData: {
		id: string
		data: Array<{
			x: Date
			y: number
		}>
	}
}

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
			[theme.breakpoints.down('sm')]: {
				height: 300,
			},
			[theme.breakpoints.up('md')]: {
				height: 500,
			},
			color: theme.palette.text.primary,
		},
		actionBtnContainer: {
			[theme.breakpoints.down('sm')]: {
				margin: '5px 0',
			},
			[theme.breakpoints.up('md')]: {
				margin: '5px 0 15px 50px',
			},
		},
		actionBtn: {
			[theme.breakpoints.down('sm')]: {
				marginTop: '8px',
			},
			[theme.breakpoints.up('md')]: {
				marginTop: '15px',
			},
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
	Hour = 'Last Hour',
	Day = 'Last Day',
	Week = 'Last Week',
	Max = 'Max',
}

/* Date format specifier for plot data */
const plotDateFormat = timeFormat('%m-%d-%Y-%H-%M-%S')

/* Date format specifier for tool tip */
const toolTipFormat = timeFormat('%b %d, %Y %H:%M')

export default function LinePlot({ title, yTitle, plotData }: PlotProps) {
	const [isHover, setHover] = useState(false)

	/* Time scale (chosen from menu in TimeScaleMenu component) */
	const [timeScale, setTimeScale] = useState<TimeScaleEnum>(TimeScaleEnum.Day)

	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

	/****************** HANDLING RERENDER WHEN SCREEN RESIZED (for responsive nivo plot) ******************/

	const [isMobile, setIsMobile] = useState(window.screen.width < 800)

	/* Set up event listener to determine screen width and update on screen resize */
	useEffect(() => {
		const isMobileWidth = () => {
			setIsMobile(window.screen.width < 800)
		}

		window.addEventListener('resize', isMobileWidth)
		return () => {
			window.removeEventListener('resize', isMobileWidth)
		}
	}, [])

	/****************************** EDIT PLOT DATA DEPENDING ON TIME SCALE **************************/

	/* End date is latest available entry */
	const endDate = plotData.data.slice(-1)[0].x

	const startDateInt = () => {
		let date = new Date(endDate)

		switch (timeScale) {
			case TimeScaleEnum.Hour:
				return date.setHours(endDate.getHours() - 1)
			case TimeScaleEnum.Day:
				return date.setDate(endDate.getDate() - 1)
			case TimeScaleEnum.Week:
				return date.setDate(endDate.getDate() - 7)
			case TimeScaleEnum.Max:
			default:
				return plotData.data[0].x
		}
	}

	const startDate = new Date(startDateInt())
	console.log(startDate)

	/* TODO -> write the plot data according to start and end dates */
	const trimPlotData = {
		...plotData,
		data: plotData.data.map(({ x, y }) => ({
			x: plotDateFormat(x),
			y,
		})),
	}

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
			case TimeScaleEnum.Hour:
				if (isMobile) {
					return 'every 2 hours'
				}
				return 'every 1 hour'
			case TimeScaleEnum.Day:
				if (isMobile) {
					return 'every 2 days'
				}
				return 'every 1 day'
			case TimeScaleEnum.Week:
				return 'every 7 days'
			default:
				return 'every 1 hour'
		}
	}

	/************************************** PLOT THEME SETTINGS FOR MOBILE/DESKTOP SCREENS *****************************/

	/* Plot theme for mobile */
	const mobilePlotTheme = {
		grid: {
			line: {
				stroke: theme.palette.text.primary,
			},
		},
		axis: {
			legend: {
				text: {
					fill: theme.palette.text.primary,
					fontSize: 0,
				},
			},
			ticks: {
				text: {
					fill: theme.palette.text.primary,
					fontSize: 10,
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
	}

	/* Plot theme for desktop */
	const desktopPlotTheme = {
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
	}

	const mobilePlotMargins = {
		top: 10,
		right: 10,
		bottom: 65,
		left: 40,
	}

	const desktopPlotMargins = {
		top: 10,
		right: 50,
		bottom: 100,
		left: 100,
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
					className={classes.actionBtnContainer}
				>
					<Grid item xs={12}>
						<Button
							startIcon={<RefreshIcon />}
							color="secondary"
							variant="contained"
							className={classes.actionBtn}
							onClick={refreshData}
						>
							{' '}
							<Typography align="center" variant="body2">
								Refresh Data
							</Typography>
						</Button>
					</Grid>

					<div className={classes.actionBtn}>
						<TimeScaleMenu currTimeScale={timeScale} onScaleChange={updateTimeScale} />
					</div>
				</Grid>

				<Grid item xs={12} className={classes.chartRoot}>
					<ResponsiveLine
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						data={[trimPlotData]}
						enablePoints={!isMobile}
						lineWidth={4}
						pointSize={10}
						curve={'monotoneX'}
						enableGridY={true}
						enableGridX={true}
						colors={isHover ? theme.palette.text.primary : theme.palette.text.secondary}
						margin={isMobile ? mobilePlotMargins : desktopPlotMargins}
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
							legendOffset: isMobile ? 40 : 50,
							legendPosition: 'middle',
						}}
						axisLeft={{
							orient: 'left',
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: yTitle,
							legendOffset: isMobile ? -45 : -70,
							legendPosition: 'middle',
						}}
						useMesh={true}
						theme={isMobile ? mobilePlotTheme : desktopPlotTheme}
						tooltip={({ point }) => {
							return (
								<div className={classes.toolTip}>
									<p>{toolTipFormat(new Date(point.data.x))}</p>
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
