import { SET_ALERT, RESET_ALERT } from '../actions/types'

export interface IAlertState {
	alerts: Array<{
		id: string
		message: string
		type: string
	}>
}

const initialState: IAlertState = {
	alerts: [],
}

type Action = { type: string; payload: IAlertState }

export const alerts = (state: IAlertState = initialState, action: Action) => {
	switch (action.type) {
		case SET_ALERT:
			return { ...state, alerts: [...state.alerts, action.payload] }
		case RESET_ALERT:
			return
		default:
			return state
	}
}
