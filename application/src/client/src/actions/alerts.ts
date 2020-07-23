import { SET_ALERT, RESET_ALERT } from './types'

import { v4 as uuidv4 } from 'uuid'

/************************ INTERFACES & TYPES ***************************/

export type setActionType = {
	type: 'SET_ALERT'
	payload: {
		id: string
		message: string
		type: string
	}
}

export type resetActionType = {
	type: 'RESET_ALERT'
	payload: string
}

/**************************** ACTIONS ********************************/

export const setAlert = (msg: string, type: string, timeout: number = 4000) => (
	dispatch: Function
) => {
	const id: string = uuidv4()

	const action: setActionType = {
		type: SET_ALERT,
		payload: {
			id,
			message: msg,
			type,
		},
	}

	dispatch(action)

	/* Automatically reset alert after timeout elapses */
	setTimeout(() => {
		const action: resetActionType = {
			type: RESET_ALERT,
			payload: id,
		}
		dispatch(action)
	}, timeout)
}

export const resetAlert = (id: string) => (dispatch: Function) => {
	const action: resetActionType = {
		type: 'RESET_ALERT',
		payload: id,
	}

	dispatch(action)
}
