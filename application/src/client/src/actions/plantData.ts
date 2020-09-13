import axios from 'axios'

import { PLANT_DATA_LOAD, PLANT_DATA_CLEAR } from '../actions/types'

import { setAuthToken } from './setAuthToken'

import { setAlert } from './alerts'
import { userLogout } from './auth'

/************************ RESPONSE TYPES ***************************/

export type plantDataRawType = {
	soilMoisture: Array<{
		measurement: number
		date: string
	}>
	lightLevel: Array<{
		measurement: number
		date: string
	}>
}

export type plantDataCorrType = {
	soilMoisture?: Array<{
		measurement: number
		date: Date
	}>
	lightLevel?: Array<{
		measurement: number
		date: Date
	}>
}

/************************ ACTION TYPES ***************************/

export type loadDataType = {
	type: 'PLANT_DATA_LOAD'
	payload: plantDataCorrType
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

		const rawData: plantDataRawType = res.data.plantData
		let payload: plantDataCorrType = {}

		/* Populate soil moisture with date object data */
		payload.soilMoisture = rawData.soilMoisture.map(({ measurement, date }) => {
			return {
				measurement,
				date: new Date(date),
			}
		})

		/* Populate light level with date object data */
		payload.lightLevel = rawData.lightLevel.map(({ measurement, date }) => {
			return {
				measurement,
				date: new Date(date),
			}
		})

		const action: loadDataType = {
			type: PLANT_DATA_LOAD,
			payload,
		}

		dispatch(action)
	} catch (error) {
		dispatch(clearPlantData())

		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))

		/* Logout user if login is invalid or token has expired */
		if (errors.includes('Token is invalid')) {
			dispatch(userLogout())
		}
	}
}

/* Clear plant data state */
export const clearPlantData = () => (dispatch: Function) => {
	const action: clearDataType = {
		type: PLANT_DATA_CLEAR,
	}

	dispatch(action)
}
