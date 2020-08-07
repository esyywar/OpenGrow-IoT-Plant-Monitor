import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useTheme } from '@material-ui/core/styles'
import { Grid, Button, Paper } from '@material-ui/core/'

import EditIcon from '@material-ui/icons/Edit'

import NamePlantModal from './NamePlantModal'

export default function PlantCard({ id, name, cardNum }: InferProps<typeof PlantCard.propTypes>) {
	const theme = useTheme()

	const [modalOpen, setModalOpen] = useState(false)

	const plantImg = require('../../media/cartoon-potted-plant.jpg')

	return (
		<Grid item xs={12} lg={6}>
			<Paper
				className="plant-card"
				style={{
					backgroundColor:
						cardNum % 2 === 0 ? theme.palette.primary.light : theme.palette.secondary.light,
				}}
			>
				<Grid container item xs={12} direction="row" alignItems="center" justify="space-around">
					<Grid item xs={6} lg={3} className="plant-card-img-container">
						<img src={plantImg} className="plant-card-avatar" alt="cartoon-potted-plant" />
					</Grid>
					<Grid item xs={6} lg={9} className="plant-card-content">
						<Grid container xs={12} direction="row" alignItems="center" justify="flex-start">
							<h4 className="plant-card-title">{name}</h4>
							<Button onClick={() => setModalOpen(true)}>
								<EditIcon />
							</Button>
						</Grid>

						<Grid container xs={12} direction="row" alignItems="center" justify="flex-start">
							<Button className="data-btn" variant="contained" color="primary">
								View Data
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Paper>

			<NamePlantModal
				plantId={id}
				currName={name}
				isOpen={modalOpen}
				handleClose={() => setModalOpen(false)}
			/>
		</Grid>
	)
}

PlantCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	cardNum: PropTypes.number.isRequired,
}
