import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setActivePlant } from '../../actions/userPlants'

import PropTypes, { InferProps } from 'prop-types'

import { useTheme } from '@material-ui/core/styles'
import { Grid, Button, Paper } from '@material-ui/core/'

import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import NamePlantModal from './Modals/NamePlantModal'
import RemovePlantModal from './Modals/RemovePlantModal'

export default function PlantCard({ id, name, cardNum }: InferProps<typeof PlantCard.propTypes>) {
	const dispatch = useDispatch()

	const theme = useTheme()

	const [plantNameModal, setPlantNameModal] = useState(false)
	const [removePlantModal, setRemovePlantModal] = useState(false)

	const plantImg = require('../../media/cartoon-potted-plant.jpg')

	const history = useHistory()

	/* Set the clicked plant as active and go to plant monitor page */
	const handleViewDataClick = (event: React.MouseEvent) => {
		dispatch(setActivePlant(id))
		history.push('/plantMonitor')
	}

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
						<Grid container direction="row" alignItems="center" justify="flex-start">
							<h4 className="plant-card-title">{name}</h4>
							<Button onClick={() => setPlantNameModal(true)}>
								<EditIcon />
							</Button>
						</Grid>

						<Grid container direction="row" alignItems="center" justify="space-between">
							<Button
								className="plant-card-btn"
								variant="contained"
								color="primary"
								onClick={handleViewDataClick}
							>
								View Data
							</Button>
							<Button
								className="plant-card-btn delete-btn"
								variant="contained"
								onClick={() => setRemovePlantModal(true)}
							>
								<DeleteForeverIcon />
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Paper>

			<NamePlantModal
				plantId={id}
				currName={name}
				isOpen={plantNameModal}
				handleClose={() => setPlantNameModal(false)}
			/>

			<RemovePlantModal
				plantId={id}
				isOpen={removePlantModal}
				handleClose={() => setRemovePlantModal(false)}
			/>
		</Grid>
	)
}

PlantCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	cardNum: PropTypes.number.isRequired,
}
