import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { ResponsiveLine } from '@nivo/line'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useTheme, Theme, Grid } from '@material-ui/core/'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		chartRoot: {
			padding: theme.spacing(2),
			borderRadius: theme.spacing(2),
			width: 620,
			height: 400,
		},
		toolTip: {
			backgroundColor: 'white',
			border: '2px solid ' + theme.palette.primary.main,
			borderRadius: theme.spacing(2),
			padding: theme.spacing(2),
			fontFamily: 'Helvetica',
			fontSize: 12,
			color: theme.palette.primary.main,
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
		<Grid
			item
			xs={12}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className={classes.chartRoot}
		>
			<ResponsiveLine
				data={[{ id: dataId, data }]}
				curve={'monotoneX'}
				enableGridY={true}
				enableGridX={true}
				colors={isHover ? theme.palette.primary.main : theme.palette.primary.light}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
					legendOffset: 36,
					legendPosition: 'middle',
				}}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: dataId,
					legendOffset: -40,
					legendPosition: 'middle',
				}}
			/>
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
