import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useTypedSelector } from '../../reducers'

import { loadUserPlants } from '../../actions/userPlants'

import { Grid, Typography, Theme } from '@material-ui/core/'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import Spinner from '../util/Spinner'
import NoUserPlants from './NoUserPlants'
import PlantCard from './PlantCard'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		plantListTitle: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: 35,
			margin: '40px 0 15px 0',
			color: theme.palette.text.primary,
		},
	})
)

export default function UserPlantList() {
	const dispatch = useDispatch()

	const classes = useStyles()

	useEffect(() => {
		dispatch(loadUserPlants())
	}, [dispatch])

	const userPlants = useTypedSelector((state) => state.userPlantsState)

	return (
		<Grid
			container
			direction="row"
			alignItems="center"
			justify="flex-start"
			className="user-plant-list"
		>
			<Grid item xs={12}>
				<Typography variant="h4" className={classes.plantListTitle}>
					Your Plants
				</Typography>
			</Grid>
			{userPlants.isLoading ? (
				<Spinner />
			) : userPlants.userPlants.length > 0 ? (
				userPlants.userPlants.map((plant, index) => {
					return (
						<PlantCard key={plant.plantId} id={plant.plantId} name={plant.name} cardNum={index} />
					)
				})
			) : (
				<NoUserPlants />
			)}
		</Grid>
	)
}
