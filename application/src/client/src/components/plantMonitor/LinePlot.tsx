import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { ResponsiveLine } from '@nivo/line'

import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useTheme, Theme, Grid, Typography, Paper } from '@material-ui/core/'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		titleRoot: {
			fontFamily: "'Mulish', sans-seif",
			fontWeight: 600,
		},
		chartRoot: {
			width: '100%',
			height: 500,
			padding: theme.spacing(2),
			color: theme.palette.text.primary,
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

export default function LinePlot({ dataId, data }: InferProps<typeof LinePlot.propTypes>) {
	const [isHover, setHover] = useState(false)

	const theme = useTheme()

	const classes = useStyles()

	return (
		<Grid item xs={12}>
			<Paper
				style={{
					backgroundColor: theme.palette.background.paper,
					borderWidth: '4px',
					borderStyle: 'solid',
					borderColor: isHover ? theme.palette.secondary.light : theme.palette.secondary.main,
				}}
				className={classes.chartRoot}
			>
				<Typography align="center" variant="h5" className={classes.titleRoot}>
					{dataId}
				</Typography>
				<ResponsiveLine
					data={[{ id: dataId, data }]}
					lineWidth={4}
					pointSize={10}
					curve={'monotoneX'}
					enableGridY={true}
					enableGridX={true}
					colors={isHover ? theme.palette.text.primary : theme.palette.text.secondary}
					margin={{ top: 50, right: 110, bottom: 100, left: 100 }}
					xScale={{ format: '%m-%d-%Y-%H-%M-%S', type: 'time' }}
					xFormat="time:%m-%d-%Y-%H-%M-%S"
					yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						orient: 'bottom',
						format: '%m-%d',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						tickValues: 'every 1 hour',
						legend: 'Time',
						legendOffset: 50,
						legendPosition: 'middle',
					}}
					axisLeft={{
						orient: 'left',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: dataId,
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
								<p>{point.data.x.toString()}</p>
								<p>{`${dataId}: ${point.data.y}`}</p>
							</div>
						)
					}}
				/>
			</Paper>
		</Grid>
	)
}

LinePlot.propTypes = {
	dataId: PropTypes.string.isRequired,
	data: {
		x: PropTypes.number.isRequired,
		y: PropTypes.instanceOf(Date).isRequired,
	},
}
