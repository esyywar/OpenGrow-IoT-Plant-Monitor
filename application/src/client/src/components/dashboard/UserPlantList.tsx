import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useTypedSelector } from '../../reducers'

import { loadUserPlants } from '../../actions/userPlants'

import { Grid } from '@material-ui/core/'

import Spinner from '../util/Spinner'
import PlantCard from './PlantCard'

export default function UserPlantList() {
	const dispatch = useDispatch()

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
				<h4 className="user-plant-list-title">Your Plants</h4>
			</Grid>
			{userPlants.isLoading ? (
				<Spinner />
			) : (
				userPlants.userPlants.map((plant, index) => {
					return (
						<PlantCard key={plant.plantId} id={plant.plantId} name={plant.name} cardNum={index} />
					)
				})
			)}
		</Grid>
	)
}
