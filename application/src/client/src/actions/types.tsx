/******************** ALERT STATE *****************/

export const SET_ALERT = 'SET_ALERT'
export const RESET_ALERT = 'RESET_ALERT'

/******************** USER AUTHENTICATION ****************/

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILED = 'REGISTER_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'

/******************** USER PLANTS *******************/

export const LOAD_PLANTS = 'LOAD_PLANTS'
export const ADD_PLANT = 'ADD_PLANT'
export const REMOVE_PLANT = 'REMOVE_PLANT'
export const CLEAR_PLANTS = 'CLEAR_PLANTS'

/****************** ACTIVE PLANT (BELGONING TO AUTHENTICATED USER) ***************/

export const PLANT_LOAD_DATA = 'PLANT_LOAD_DATA'
export const PLANT_SETPOINT_CHANGE = 'PLANT_SETPOINT_CHANGE'
export const PLANT_TOLERANCE_CHANGE = 'PLANT_TOLERANCE_CHANGE'

/******************* STATE INTERFACES *********************/

export interface AlertState {
	alerts: Array<{
		id: string
		message: string
		type: string
	}>
}

export interface UserAuthState {
	auth: {
		userId: string | null
		username: string | null
		token: string | null
		isLoading: boolean
		isAuthenticated: boolean
	}
}

export interface UserPlantsState {
	userPlants: Array<{
		name: string
		plantId: string
	}>
	isLoading: boolean
}
