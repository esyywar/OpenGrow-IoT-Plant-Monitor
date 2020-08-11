import { UserPlantsState } from '../actions/types'

import {
	LOAD_PLANTS,
	ADD_PLANT,
	REMOVE_PLANT,
	CLEAR_PLANTS,
	RENAMED_PLANT,
	SET_ACTIVE_PLANT,
	CLEAR_ACTIVE_PLANT,
} from '../actions/types'

import {
	loadAllPlantsType,
	removePlantType,
	clearPlantsType,
	setActivePlantType,
	clearActivePlantType,
} from '../actions/userPlants'

const initialState: UserPlantsState = {
	userPlants: [],
	isLoading: true,
}

export const userPlantsState = (
	state = initialState,
	action:
		| loadAllPlantsType
		| removePlantType
		| clearPlantsType
		| setActivePlantType
		| clearActivePlantType
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
		case SET_ACTIVE_PLANT:
			return {
				userPlants: state.userPlants.map((plant) => {
					return {
						...plant,
						isActive: plant.plantId === action.payload ? true : false,
					}
				}),
				isLoading: false,
			}
		case CLEAR_ACTIVE_PLANT:
			return {
				userPlants: state.userPlants.map(({ isActive }) => (isActive = false)),
				isLoading: false,
			}
		case CLEAR_PLANTS:
			return { userPlants: [], isLoading: false }
		default:
			return state
	}
}
