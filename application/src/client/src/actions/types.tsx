/******************** ALERT STATE *****************/

export const SET_ALERT = 'SET_ALERT'
export const RESET_ALERT = 'RESET_ALERT'

export interface AlertState {
	alerts: Array<{
		id: string
		message: string
		type: string
	}>
}

/******************** DARK/LIGHT MODE ****************/

export const SET_LIGHT_MODE = 'SET_LIGHT_MODE'
export const SET_DARK_MODE = 'SET_DARK_MODE'

export interface DarkModeState {
	isDarkMode: boolean
}

/******************** USER AUTHENTICATION ****************/

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILED = 'REGISTER_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'
export const LOADED_USER = 'LOADED_USER'

export interface UserAuthState {
	auth: {
		userId: string | null
		username: string | null
		token: string | null
		isLoading: boolean
		isAuthenticated: boolean
	}
}

/******************** USER PLANTS *******************/

export const LOAD_PLANTS = 'LOAD_PLANTS'
export const ADD_PLANT = 'ADD_PLANT'
export const REMOVE_PLANT = 'REMOVE_PLANT'
export const CLEAR_PLANTS = 'CLEAR_PLANTS'
export const RENAMED_PLANT = 'RENAMED_PLANT'

export interface UserPlantsState {
	userPlants: Array<{
		name: string
		plantId: string
	}>
	isLoading: boolean
}

/********************** ACTIVE PLANT ********************/

export const LOAD_ACTIVE_PLANT = 'LOAD_ACTIVE_PLANT'
export const SET_ACTIVE_PLANT = 'SET_ACTIVE_PLANT'
export const CLEAR_ACTIVE_PLANT = 'CLEAR_ACTIVE_PLANT'

export interface ActivePlantState {
	activePlant: {
		name: string
		plantId: string
	}
	isLoading: boolean
}

/********************** PLANT DATA **********************/

export const PLANT_DATA_LOAD = 'PLANT_DATA_LOAD'
export const PLANT_DATA_CLEAR = 'PLANT_DATA_CLEAR'

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

/********************* PLANT CONTROL **********************/

export const PLANT_CONTROL_LOAD = 'PLANT_CONTROL_LOAD'
export const PLANT_SETPOINT_UPDATE = 'PLANT_SETPOINT_UPDATE'
export const PLANT_TOLERANCE_UPDATE = 'PLANT_TOLERANCE_UPDATE'
export const PLANT_CONTROL_CLEAR = 'PLANT_CONTROL_CLEAR'

export interface PlantControlState {
	control: {
		soilMoisture: {
			setpoint: number
			tolerance: number
		}
	}
	isLoading: boolean
}
