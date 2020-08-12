import { combineReducers } from 'redux'

import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { alertState } from './alertState'
import { authState } from './authState'
import { userPlantsState } from './userPlantsState'
import { activePlantState } from './activePlantState'
import { plantDataState } from './plantDataState'
import { plantControlState } from './plantControlState'

import {
	AlertState,
	UserAuthState,
	UserPlantsState,
	ActivePlantState,
	PlantDataState,
	PlantControlState,
} from '../actions/types'

const rootReducer = combineReducers({
	alertState,
	authState,
	userPlantsState,
	activePlantState,
	plantDataState,
	plantControlState,
})

interface RootState {
	alertState: AlertState
	authState: UserAuthState
	userPlantsState: UserPlantsState
	activePlantState: ActivePlantState
	plantDataState: PlantDataState
	plantControlState: PlantControlState
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
