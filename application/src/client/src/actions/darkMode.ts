import { SET_LIGHT_MODE, SET_DARK_MODE } from './types'

/************************ ACTION TYPES ***************************/

export type darkModeActionType = {
	type: 'SET_LIGHT_MODE' | 'SET_DARK_MODE'
}

/**************************** ACTIONS ********************************/

/* Set to dark mode */
export const setDarkMode = () => (dispatch: Function) => {
	const action: darkModeActionType = {
		type: SET_DARK_MODE,
	}

	dispatch(action)
}

/* Set to light mode */
export const setLightMode = () => (dispatch: Function) => {
	const action: darkModeActionType = {
		type: SET_LIGHT_MODE,
	}

	dispatch(action)
}
