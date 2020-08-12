import axios from 'axios'

import { PLANT_DATA_LOAD, PLANT_DATA_CLEAR } from '../actions/types'

import { setAuthToken } from './setAuthToken'

import { setAlert } from './alerts'

/************************ ACTION TYPES ***************************/

export type loadDataType = {
	type: 'PLANT_DATA_LOAD'
	payload: {
		soilMoisture: Array<{
			measurement: number
			date: Date
		}>
		lightLevel: Array<{
			measurement: number
			date: Date
		}>
	}
}

export type clearDataType = {
	type: 'PLANT_DATA_CLEAR'
}

/**************************** ACTIONS ********************************/

/* Load a plant's data from id */
export const loadPlantData = (plantId: string) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	try {
		const res = await axios.get(`/api/plant/data/${plantId}`)

		const action: loadDataType = {
			type: PLANT_DATA_LOAD,
			payload: res.data.plantData,
		}

		dispatch(action)
	} catch (error) {
		dispatch(clearPlantData())

		console.log(error)

		const errors = error.response.data.errors

		//errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Clear plant data state */
export const clearPlantData = () => (dispatch: Function) => {
	const action: clearDataType = {
		type: PLANT_DATA_CLEAR,
	}

	dispatch(action)
}
