import axios from 'axios'

import { History } from 'history'

import { LOAD_ACTIVE_PLANT, SET_ACTIVE_PLANT, CLEAR_ACTIVE_PLANT } from './types'

import { setAuthToken } from './setAuthToken'

import { setAlert } from './alerts'
import { clearCtrlData } from './plantControl'
import { clearPlantData } from './plantData'

/************************ ACTION TYPES ***************************/

export type loadActivePlantType = {
	type: 'LOAD_ACTIVE_PLANT'
	payload: {
		name: string
		plantId: string
	}
}

export type setActivePlantType = {
	type: 'SET_ACTIVE_PLANT'
	payload: {
		name: string
		plantId: string
	}
}

export type clearActivePlantType = {
	type: 'CLEAR_ACTIVE_PLANT_NAME' | 'CLEAR_ACTIVE_PLANT'
}

/**************************** ACTIONS ********************************/

export const loadActivePlant = (routerHistory: History) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	if (!localStorage.activePlant) {
		dispatch(clearActivePlant())
		return
	}

	/* Load active plant from local storage */
	const activePlantId = localStorage.activePlant

	try {
		/* Make sure that activePlant is registered to logged in user */
		const res = await axios.get('/api/user/plants')

		const activePlant = res.data.plants.filter((item: any) => item.plant === activePlantId)[0]

		if (!activePlant) {
			/* If active plant not registered to user, redirect to dashboard */
			routerHistory.push('/dashboard')
		}

		const action: loadActivePlantType = {
			type: LOAD_ACTIVE_PLANT,
			payload: {
				name: activePlant.name,
				plantId: activePlant.plant,
			},
		}

		dispatch(action)
	} catch (error) {
		dispatch(clearActivePlant())

		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Set a plant as active */
export const setActivePlant = (plantId: string) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	try {
		const res = await axios.get('/api/user/plants')

		/* Get the active plant from the user's registered plants */
		const activePlant = res.data.plants.filter((item: any) => item.plant === plantId)[0]

		/* Make sure that plant exists in user's associatd plants or throw error */
		if (!activePlant) {
			dispatch(setAlert('This plant is not associated with your account!', 'error'))
			return
		}

		const action: setActivePlantType = {
			type: SET_ACTIVE_PLANT,
			payload: {
				name: activePlant.name,
				plantId: activePlant.plant,
			},
		}

		dispatch(action)
	} catch (error) {
		dispatch(clearActivePlant())

		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Clear the active plant */
export const clearActivePlant = () => (dispatch: Function) => {
	const action: clearActivePlantType = {
		type: CLEAR_ACTIVE_PLANT,
	}

	dispatch(action)
	dispatch(clearCtrlData())
	dispatch(clearPlantData())
}
