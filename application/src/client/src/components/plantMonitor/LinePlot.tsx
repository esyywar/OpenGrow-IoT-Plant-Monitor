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
	})
)

export default function LinePlot({ dataId, data }: InferProps<typeof LinePlot.propTypes>) {
	const [isHover, setHover] = useState(false)

	const theme = useTheme()

	const nivoTheme = {
		axis: {
			textColor: theme.palette.text.primary,
			fontSize: '14px',
			tickColor: '#eee',
		},
		grid: {
			stroke: '#888',
			strokeWidth: 1,
		},
	}

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
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					data={[{ id: dataId, data }]}
					curve={'monotoneX'}
					enableGridY={true}
					enableGridX={true}
					colors={isHover ? theme.palette.secondary.main : theme.palette.primary.main}
					margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
					xScale={{ type: 'linear' }}
					yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						orient: 'bottom',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
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
						legendOffset: -50,
						legendPosition: 'middle',
					}}
					useMesh={true}
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
