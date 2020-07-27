import {
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	REGISTER_SUCCESS,
	REGISTER_FAILED,
	LOGOUT_USER,
} from './types'

import { setAlert } from './alerts'

import axios from 'axios'

/************************ ARGUEMENT TYPES ***************************/

export type loginCredsType = {
	email: string
	password: string
}

export type registerCredsType = {
	username: string
	email: string
	password: string
}

/************************ ACTION TYPES ***************************/

export type authSuccessType = {
	type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'
	payload: {
		userId: string
		username: string
		token: string
	}
}

/**************************** ACTIONS ********************************/

/* Attempt user login */
export const userLogin = (loginCreds: loginCredsType) => async (dispatch: Function) => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	const body = JSON.stringify({ email: loginCreds.email, password: loginCreds.password })

	try {
		const res = await axios.post('api/user/login', body, config)

		const action: authSuccessType = {
			type: LOGIN_SUCCESS,
			payload: res.data,
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Register a user */
export const registerUser = (registerCreds: registerCredsType) => async (dispatch: Function) => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	const body = JSON.stringify({
		username: registerCreds.username,
		email: registerCreds.email,
		password: registerCreds.password,
	})

	try {
		const res = await axios.post('/api/user/register', body, config)

		const action: authSuccessType = {
			type: LOGIN_SUCCESS,
			payload: res.data,
		}

		dispatch(action)
	} catch (error) {
		const errors = error.response.data.errors

		errors.forEach((error: any) => dispatch(setAlert(error.msg, 'error')))
	}
}

/* Logout user */
export const userLogout = () => (dispatch: Function) => {
	dispatch({ type: LOGOUT_USER })
}
