import { DarkModeState } from '../actions/types'

import { SET_LIGHT_MODE, SET_DARK_MODE } from '../actions/types'

const initialState: DarkModeState = {
	isDarkMode: localStorage.getItem('darkMode') ? true : false,
}

export const darkModeState = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_LIGHT_MODE:
			localStorage.removeItem('darkMode')
			return { isDarkMode: false }
		case SET_DARK_MODE:
			localStorage.setItem('darkMode', 'dark')
			return { isDarkMode: true }
		default:
			return state
	}
}
