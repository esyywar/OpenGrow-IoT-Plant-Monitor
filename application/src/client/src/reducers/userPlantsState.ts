import { UserPlantsState } from '../actions/types'

import { LOAD_PLANTS, ADD_PLANT, REMOVE_PLANT, CLEAR_PLANTS, RENAMED_PLANT } from '../actions/types'

import { loadAllPlantsType, removePlantType, clearPlantsType } from '../actions/userPlants'

const initialState: UserPlantsState = {
	userPlants: [],
	isLoading: true,
}

export const userPlantsState = (
	state = initialState,
	action: loadAllPlantsType | removePlantType | clearPlantsType
) => {
	switch (action.type) {
		case RENAMED_PLANT:
		case ADD_PLANT:
		case LOAD_PLANTS:
			return { userPlants: action.payload, isLoading: false }
		case REMOVE_PLANT:
			return {
				userPlants: state.userPlants.filter((plant) => plant.plantId !== action.payload),
				isLoading: false,
			}
		case CLEAR_PLANTS:
			return { userPlants: [], isLoading: false }
		default:
			return state
	}
}
