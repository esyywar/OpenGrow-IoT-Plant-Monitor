import axios from 'axios'

import { LOAD_PLANTS, ADD_PLANT, REMOVE_PLANT, CLEAR_PLANTS, RENAMED_PLANT } from './types'

import { setAuthToken } from './setAuthToken'

import { setAlert } from './alerts'
import { userLogout } from './auth'

/************************ ARGUEMENT TYPES ***************************/

type renamePlantType = {
	plantId: string
	name: string
}

/************************ ACTION TYPES ***************************/

/* Note: is active param indicates which plant's data is currently loaded */
export type loadAllPlantsType = {
	type: 'LOAD_PLANTS' | 'ADD_PLANT' | 'RENAMED_PLANT'
	payload: Array<{
		name: string
		plantId: string
		isActive: boolean
	}>
}

/* Payload is plant's id */
export type removePlantType = {
	type: 'REMOVE_PLANT'
	payload: string
}

export type clearPlantsType = {
	type: 'CLEAR_PLANTS'
}

/**************************** ACTIONS ********************************/

/* Load plants registered to a logged in user's account */
export const loadUserPlants = () => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	try {
		const res = await axios.get('/api/user/plants')

		const action: loadAllPlantsType = {
			type: LOAD_PLANTS,
			payload: res.data.plants.map((item: any) => {
				return {
					name: item.name,
					plantId: item.plant,
					isActive: false,
				}
			}),
		}

		dispatch(action)
	} catch (error) {
		dispatch(clearUserPlants())

		const errors = error.response.data.errors

		console.log(errors)

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))

		/* Logout user if login is invalid or token has expired */
		if (errors.some((error: { msg: string }) => error.msg === 'Token is not valid')) {
			dispatch(userLogout())
		}
	}
}

/* Add a plant by id to the user's account */
export const addUserPlant = (plantId: string) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	try {
		const res = await axios.put(`/api/user/plant/${plantId}`)

		const action: loadAllPlantsType = {
			type: ADD_PLANT,
			payload: res.data.plants.map((item: any) => {
				return {
					name: item.name,
					plantId: item.plant,
					isActive: false,
				}
			}),
		}

		dispatch(setAlert('Plant succesfully added!', 'success'))
		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Remove a plant from user's account by id */
export const removeUserPlant = (plantId: string) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	try {
		await axios.delete(`/api/user/plant/${plantId}`)

		const action: removePlantType = {
			type: REMOVE_PLANT,
			payload: plantId,
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Rename a plant on the user's account */
export const renameUserPlant = (renamePlant: renamePlantType) => async (dispatch: Function) => {
	const { name, plantId } = renamePlant

	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	const body = JSON.stringify({ name })

	try {
		const res = await axios.post(`/api/user/plant/name/${plantId}`, body, config)

		const action: loadAllPlantsType = {
			type: RENAMED_PLANT,
			payload: res.data.plants.map((item: any) => {
				return {
					name: item.name,
					plantId: item.plant,
					isActive: false,
				}
			}),
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Clear the userPlants state */
export const clearUserPlants = () => (dispatch: Function) => {
	const action: clearPlantsType = {
		type: CLEAR_PLANTS,
	}

	dispatch(action)
}
