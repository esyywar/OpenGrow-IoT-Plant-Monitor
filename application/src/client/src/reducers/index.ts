import { combineReducers } from 'redux'

import { alerts } from './alerts'

const rootReducer = combineReducers({
	alerts,
})

export default rootReducer
