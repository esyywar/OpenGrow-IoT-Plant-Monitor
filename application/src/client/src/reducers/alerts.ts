import { SET_ALERT, RESET_ALERT } from '../actions/types'
import { setAction, resetAction } from '../actions/alerts'

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

export const alerts = (state: IAlertState = initialState, action: setAction | resetAction) => {
	switch (action.type) {
		case SET_ALERT:
			return { ...state, alerts: [...state.alerts, action.payload] }
		case RESET_ALERT:
			return state.alerts.filter((alert) => alert.id !== action.payload)
		default:
			return state
	}
}
