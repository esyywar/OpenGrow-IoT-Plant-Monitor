import { PlantDataState } from '../actions/types'

import { PLANT_DATA_LOAD, PLANT_DATA_CLEAR } from '../actions/types'

import { loadDataType, clearDataType } from '../actions/plantData'

const initialState: PlantDataState = {
	data: {
		soilMoisture: [],
		lightLevel: [],
	},
	isLoading: true,
}

export const plantDataState = (state = initialState, action: loadDataType | clearDataType) => {
	switch (action.type) {
		case PLANT_DATA_LOAD:
			return { data: action.payload, isLoading: false }
		case PLANT_DATA_CLEAR:
			return initialState
		default:
			return state
	}
}
