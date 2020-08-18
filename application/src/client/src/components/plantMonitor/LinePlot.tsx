import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { ResponsiveLine } from '@nivo/line'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'

import { useTheme, makeStyles, Theme, Grid } from '@material-ui/core/'

const useStyles = (theme: Theme) =>
	makeStyles({
		chartRoot: {
			padding: theme.spacing(6),
			borderRadius: theme.spacing(2),
			backgroundColor: 'white',
			width: 620,
			height: 240,
			border: '1px solid rgba(0,0,0,0.15)',
			transition: 'box-shadow 0.3s ease-in-out',
			'&:hover': {
				border: '1px solid ' + theme.palette.primary.main,
				boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
			},
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

export default function LinePlot({ data }: InferProps<typeof LinePlot.propTypes>) {
	const [isHover, setHover] = useState(false)

	const theme = useTheme()

	const classes = useStyles(theme)

	return (
		<Grid
			item
			xs={12}
			lg={6}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<ResponsiveLine
				data={data}
				curve={'monotoneX'}
				enableGridY={isHover}
				enableGridX={isHover}
				colors={isHover ? theme.palette.primary.main : theme.palette.primary.light}
			/>
		</Grid>
	)
}

LinePlot.propTypes = {
	data: {
		id: PropTypes.string.isRequired,
		data: {
			x: PropTypes.number.isRequired,
			y: PropTypes.instanceOf(Date).isRequired,
		},
	},
}
