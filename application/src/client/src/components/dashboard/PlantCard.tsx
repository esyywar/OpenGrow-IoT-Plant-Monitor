import React, { useEffect } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useTheme } from '@material-ui/core/styles'
import { Grid, Button, Paper } from '@material-ui/core/'

export default function PlantCard({ id, name, cardNum }: InferProps<typeof PlantCard.propTypes>) {
	const theme = useTheme()

	const plantImg = require('../../media/cartoon-potted-plant.jpg')

	return (
		<Paper
			className="plant-card"
			style={{
				backgroundColor:
					cardNum % 2 === 0 ? theme.palette.primary.light : theme.palette.secondary.light,
			}}
		>
			<Grid container item xs={12} lg={6} direction="row" alignItems="center" justify="flex-start">
				<Grid item xs={4} className="plant-card-img-container" style={{ border: '2px solid red' }}>
					<img src={plantImg} className="plant-card-avatar" alt="cartoon-potted-plant" />
				</Grid>
				<Grid item xs={6} className="plant-card-content" style={{ border: '2px solid green' }}>
					<h4 className="plant-card-title">{name}</h4>
				</Grid>
			</Grid>
		</Paper>
	)
}

PlantCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	cardNum: PropTypes.number.isRequired,
}
