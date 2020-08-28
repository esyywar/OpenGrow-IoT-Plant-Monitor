import axios from 'axios'

import {
	PLANT_CONTROL_LOAD,
	PLANT_SETPOINT_UPDATE,
	PLANT_TOLERANCE_UPDATE,
	PLANT_CONTROL_CLEAR,
} from './types'

import { setAuthToken } from './setAuthToken'

import { setAlert } from './alerts'

/************************ ARGUEMENT TYPES ***************************/

type controlUpdateType = {
	plantId: string
	setpoint?: number
	tolerance?: number
}

/************************ ACTION TYPES ***************************/

export type loadCtrlDataType = {
	type: 'PLANT_CONTROL_LOAD' | 'PLANT_SETPOINT_UPDATE' | 'PLANT_TOLERANCE_UPDATE'
	payload: {
		soilMoisture: {
			setpoint: number
			tolerance: number
		}
	}
}

export type clearCtrlDataType = {
	type: 'PLANT_CONTROL_CLEAR'
}

/**************************** ACTIONS ********************************/

/* Load plant's control data from id */
export const loadCtrlData = (plantId: string) => async (dispatch: Function) => {
	try {
		const res = await axios.get(`/api/plant/control/${plantId}`)

		const action: loadCtrlDataType = {
			type: PLANT_CONTROL_LOAD,
			payload: res.data.control,
		}

		dispatch(action)
	} catch (error) {
		console.log(error)
		dispatch(clearCtrlData())

		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Update plant's soil moisture setpoint */
export const updateSetpoint = (update: controlUpdateType) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	const body = JSON.stringify({ setpoint: update.setpoint })

	try {
		const res = await axios.post(`/api/plant/setpoint/${update.plantId}`, body, config)

		const action: loadCtrlDataType = {
			type: PLANT_SETPOINT_UPDATE,
			payload: res.data.control,
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Update plant's soil moisture tolerance */
export const updateTolerance = (update: controlUpdateType) => async (dispatch: Function) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}

	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	const body = JSON.stringify({ tolerance: update.tolerance })

	try {
		const res = await axios.post(`/api/plant/tolerance/${update.plantId}`, body, config)

		const action: loadCtrlDataType = {
			type: PLANT_TOLERANCE_UPDATE,
			payload: res.data.control,
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Clear plant control data */
export const clearCtrlData = () => (dispatch: Function) => {
	const action: clearCtrlDataType = {
		type: PLANT_CONTROL_CLEAR,
	}

	dispatch(action)
}
