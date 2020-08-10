import { PlantControlState } from '../actions/types'

import {
	PLANT_CONTROL_LOAD,
	PLANT_SETPOINT_UPDATE,
	PLANT_TOLERANCE_UPDATE,
	PLANT_CONTROL_CLEAR,
} from '../actions/types'

const initialState: PlantControlState = {
	control: {
		soilMoisture: {
			setpoint: NaN,
			tolerance: NaN,
		},
	},
	isLoading: true,
}

export const plantControlState = (state = initialState, action: any) => {
	switch (action.type) {
		default:
			return state
	}
}
