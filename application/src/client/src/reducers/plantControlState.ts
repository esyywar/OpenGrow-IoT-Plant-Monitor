import { PlantControlState } from '../actions/types'

import {
	PLANT_CONTROL_LOAD,
	PLANT_SETPOINT_UPDATE,
	PLANT_TOLERANCE_UPDATE,
	PLANT_CONTROL_CLEAR,
} from '../actions/types'

import { loadCtrlDataType, clearCtrlDataType } from '../actions/plantControl'

const initialState: PlantControlState = {
	control: {
		soilMoisture: {
			setpoint: NaN,
			tolerance: NaN,
		},
	},
	isLoading: true,
}

export const plantControlState = (
	state = initialState,
	action: loadCtrlDataType | clearCtrlDataType
) => {
	switch (action.type) {
		case PLANT_SETPOINT_UPDATE:
		case PLANT_TOLERANCE_UPDATE:
		case PLANT_CONTROL_LOAD:
			return { control: action.payload, isLoading: false }
		case PLANT_CONTROL_CLEAR:
			return initialState
		default:
			return state
	}
}
