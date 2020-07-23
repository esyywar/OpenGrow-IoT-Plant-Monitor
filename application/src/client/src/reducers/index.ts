import { combineReducers } from 'redux'

import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { alertState } from './alertState'

import { AlertState } from '../actions/types'

const rootReducer = combineReducers({
	alertState,
})

interface RootState {
	alertState: AlertState
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
