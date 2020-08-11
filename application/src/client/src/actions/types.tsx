/******************** ALERT STATE *****************/

export const SET_ALERT = 'SET_ALERT'
export const RESET_ALERT = 'RESET_ALERT'

/******************** USER AUTHENTICATION ****************/

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILED = 'REGISTER_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'
export const LOADED_USER = 'LOADED_USER'

/******************** USER PLANTS *******************/

export const LOAD_PLANTS = 'LOAD_PLANTS'
export const ADD_PLANT = 'ADD_PLANT'
export const REMOVE_PLANT = 'REMOVE_PLANT'
export const CLEAR_PLANTS = 'CLEAR_PLANTS'
export const RENAMED_PLANT = 'RENAMED_PLANT'
export const SET_ACTIVE_PLANT = 'SET_ACTIVE_PLANT'
export const CLEAR_ACTIVE_PLANT = 'CLEAR_ACTIVE_PLANT'

/********************** PLANT DATA **********************/

export const PLANT_DATA_LOAD = 'PLANT_DATA_LOAD'
export const PLANT_DATA_CLEAR = 'PLANT_DATA_CLEAR'

/********************* PLANT CONTROL **********************/

export const PLANT_CONTROL_LOAD = 'PLANT_CONTROL_LOAD'
export const PLANT_SETPOINT_UPDATE = 'PLANT_SETPOINT_UPDATE'
export const PLANT_TOLERANCE_UPDATE = 'PLANT_TOLERANCE_UPDATE'
export const PLANT_CONTROL_CLEAR = 'PLANT_CONTROL_CLEAR'

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
		isActive: boolean
	}>
	isLoading: boolean
}

export interface PlantDataState {
	data: {
		soilMoisture: Array<{
			measurement: number
			date: Date
		}>
		lightLevel: Array<{
			measurement: number
			date: Date
		}>
	}
	isLoading: boolean
}

export interface PlantControlState {
	control: {
		soilMoisture: {
			setpoint: number
			tolerance: number
		}
	}
	isLoading: boolean
}
