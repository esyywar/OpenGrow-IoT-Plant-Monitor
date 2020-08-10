import { PlantDataState } from '../actions/types'

import { PLANT_DATA_LOAD, PLANT_DATA_CLEAR } from '../actions/types'

const initialState: PlantDataState = {
	data: {
		soilMoisture: [],
		lightLevel: [],
	},
	isLoading: true,
}

export const plantDataState = (state = initialState, action: any) => {
	switch (action.type) {
		case PLANT_DATA_LOAD:
		case PLANT_DATA_CLEAR:
			return initialState
		default:
			return state
	}
}
