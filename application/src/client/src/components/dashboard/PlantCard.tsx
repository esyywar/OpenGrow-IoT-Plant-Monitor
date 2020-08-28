import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setActivePlant } from '../../actions/activePlant'

import { useTheme, createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Grid, Button, Paper } from '@material-ui/core/'

import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import NamePlantModal from './Modals/NamePlantModal'
import RemovePlantModal from './Modals/RemovePlantModal'

interface PlantCardProps {
	id: string
	name: string
	cardNum: number
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		plantCard: {
			fontFamily: "'Mulish', sans-serif",
			maxHeight: '250px',
			width: '90%',
			margin: '12px 8px',
			[theme.breakpoints.down('sm')]: {
				padding: '8px 16px',
			},
			[theme.breakpoints.up('md')]: {
				padding: '15px 30px',
			},
		},
		plantCardAvatar: {
			height: '100px',
			width: 'auto',
		},
		plantCardTitle: {
			fontSize: '20px',
			marginRight: 2,
		},
		plantCardBtn: {
			margin: '5px 0',
			padding: '8px 10px',
		},
		deleteBtn: {
			backgroundColor: 'rgb(148, 3, 3)',
		},
	})
)

export default function PlantCard({ id, name, cardNum }: PlantCardProps) {
	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

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
				className={classes.plantCard}
				style={{
					backgroundColor:
						cardNum % 2 === 0 ? theme.palette.primary.light : theme.palette.secondary.light,
				}}
			>
				<Grid container item xs={12} direction="row" alignItems="center" justify="space-around">
					<Grid item xs={6} lg={3}>
						<img src={plantImg} className={classes.plantCardAvatar} alt="cartoon-potted-plant" />
					</Grid>
					<Grid item xs={6} lg={9}>
						<Grid container direction="row" alignItems="center" justify="flex-start">
							<h4 className={classes.plantCardTitle}>{name}</h4>
							<Button onClick={() => setPlantNameModal(true)}>
								<EditIcon />
							</Button>
						</Grid>

						<Grid container direction="row" alignItems="center" justify="space-between">
							<Button
								className={classes.plantCardBtn}
								variant="contained"
								color="primary"
								onClick={handleViewDataClick}
							>
								View Data
							</Button>
							<Button
								className={`${classes.plantCardBtn} ${classes.deleteBtn}`}
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
