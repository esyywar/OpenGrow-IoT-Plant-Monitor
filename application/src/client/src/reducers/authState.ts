import { UserAuthState } from '../actions/types'
import {
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	REGISTER_SUCCESS,
	REGISTER_FAILED,
	LOGOUT_USER,
} from '../actions/types'

const initialState: UserAuthState = {
	auth: {
		userId: null,
		username: null,
		token: null,
		isLoading: true,
		isAuthenticated: false,
	},
}

export const authState = (state = initialState, action: any) => {
	switch (action.type) {
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			return {
				...state,
				auth: {
					userId: action.payload.userId,
					username: action.payload.username,
					token: action.payload.token,
					isLoading: false,
					isAuthenticated: true,
				},
			}
		case LOGIN_FAILED:
		case REGISTER_FAILED:
		case LOGOUT_USER:
			return {
				...state,
				auth: {
					...state.auth,
					userId: null,
					token: null,
					isLoading: false,
					isAuthenticated: false,
				},
			}
		default:
			return state
	}
}
