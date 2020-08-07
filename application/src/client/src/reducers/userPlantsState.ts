import { UserPlantsState } from '../actions/types'

import { LOAD_PLANTS, ADD_PLANT, REMOVE_PLANT, CLEAR_PLANTS, RENAMED_PLANT } from '../actions/types'

const initialState: UserPlantsState = {
	userPlants: [],
	isLoading: true,
}

export const userPlantsState = (state = initialState, action: any) => {
	switch (action.type) {
		case RENAMED_PLANT:
		case LOAD_PLANTS:
			return { userPlants: action.payload, isLoading: false }
		case ADD_PLANT:
			return { userPlants: [...state.userPlants, action.payload], isLoading: false }
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
