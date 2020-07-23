/******************** ALERT STATE *****************/

export const SET_ALERT = 'SET_ALERT'
export const RESET_ALERT = 'RESET_ALERT'

/******************** USER AUTHENTICATION ****************/

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILED = 'REGISTER_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'

/******************* INTERFACES *********************/

export interface AlertState {
	alerts: Array<{
		id: string
		message: string
		type: string
	}>
}
