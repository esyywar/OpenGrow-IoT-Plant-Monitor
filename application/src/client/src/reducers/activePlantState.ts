import { ActivePlantState } from '../actions/types'

import { LOAD_ACTIVE_PLANT, SET_ACTIVE_PLANT, CLEAR_ACTIVE_PLANT } from '../actions/types'

import {
	loadActivePlantType,
	setActivePlantType,
	clearActivePlantType,
} from '../actions/activePlant'

const initialState: ActivePlantState = {
	activePlant: {
		name: '',
		plantId: localStorage.getItem('activePlant'),
	},
	isLoading: true,
}

export const activePlantState = (
	state = initialState,
	action: loadActivePlantType | setActivePlantType | clearActivePlantType
) => {
	switch (action.type) {
		case LOAD_ACTIVE_PLANT:
		case SET_ACTIVE_PLANT:
			localStorage.setItem('activePlant', action.payload.plantId)
			return { activePlant: action.payload, isLoading: false }
		case CLEAR_ACTIVE_PLANT:
			localStorage.removeItem('activePlant')
			return { ...initialState, isLoading: false }
		default:
			return state
	}
}
