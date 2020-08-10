import { AlertState } from '../actions/types'

import { SET_ALERT, RESET_ALERT } from '../actions/types'

import { setActionType, resetActionType } from '../actions/alerts'

const initialState: AlertState = {
	alerts: [],
}

export const alertState = (state = initialState, action: setActionType | resetActionType) => {
	switch (action.type) {
		case SET_ALERT:
			return { alerts: [...state.alerts, action.payload] }
		case RESET_ALERT:
			return { alerts: state.alerts.filter((alert) => alert.id !== action.payload) }
		default:
			return state
	}
}
