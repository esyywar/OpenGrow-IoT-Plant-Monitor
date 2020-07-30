import { combineReducers } from 'redux'

import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { alertState } from './alertState'
import { authState } from './authState'
import { userPlantsState } from './userPlantsState'

import { AlertState } from '../actions/types'
import { UserAuthState } from '../actions/types'
import { UserPlantsState } from '../actions/types'

const rootReducer = combineReducers({
	alertState,
	authState,
	userPlantsState,
})

interface RootState {
	alertState: AlertState
	authState: UserAuthState
	userPlantsState: UserPlantsState
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
