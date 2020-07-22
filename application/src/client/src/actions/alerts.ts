import { SET_ALERT, RESET_ALERT } from './types'

import { v4 as uuidv4 } from 'uuid'

/************************ INTERFACES & TYPES ***************************/

export type setAction = {
	type: 'SET_ALERT'
	payload: {
		id: string
		message: string
		type: string
	}
}

export type resetAction = {
	type: 'RESET_ALERT'
	payload: string
}

/**************************** ACTIONS ********************************/

export const setAlert = (msg: string, type: string, timeout: number = 3000) => (
	dispatch: Function
) => {
	const action: setAction = {
		type: SET_ALERT,
		payload: {
			id: uuidv4(),
			message: msg,
			type,
		},
	}

	dispatch(action)

	/* Automatically reset alert after timeout elapses */
	setTimeout((dispatch, id) => {
		const action: resetAction = {
			type: RESET_ALERT,
			payload: id,
		}
		dispatch(action)
	}, timeout)
}

export const resetAlert = (id: string) => (dispatch: Function) => {
	const action: resetAction = {
		type: 'RESET_ALERT',
		payload: id,
	}

	dispatch(action)
}
