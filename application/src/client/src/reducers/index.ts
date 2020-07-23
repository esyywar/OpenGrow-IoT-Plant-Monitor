import { combineReducers } from 'redux'

import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { alertState } from './alertState'
import { authState } from './authState'

import { AlertState } from '../actions/types'
import { UserAuthState } from '../actions/types'

const rootReducer = combineReducers({
	alertState,
	authState,
})

interface RootState {
	alertState: AlertState
	authState: UserAuthState
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
