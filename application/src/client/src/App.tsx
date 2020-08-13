import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import { useTypedSelector } from './reducers'

import { Container } from '@material-ui/core'

import PrivateRoute from './components/util/PrivateRoute'

import Alerts from './components/util/Alerts'
import Navbar from './components/navigation/Navbar'
import Landing from './components/landing/Landing'
import Login from './components/userForms/Login'

import Dashboard from './components/dashboard/Dashboard'

import PlantMonitor from './components/plantMonitor/PlantMonitor'

import { useTheme } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

function App() {
	const isDarkMode = useTypedSelector((state) => state.darkModeState.isDarkMode)
	console.log(isDarkMode)

	/* Creating custom material-ui themes */
	const lightTheme = createMuiTheme({
		palette: {
			type: 'light',
			primary: {
				light: '#BDD9BD',
				main: '#4F772D',
				dark: '#0D1C0D',
			},
			secondary: {
				light: '#A69CAC',
				main: '#474973',
				dark: '#0D0C1D',
			},
		},
	})

	const darkTheme = createMuiTheme({
		palette: {
			type: 'dark',
		},
	})

	const theme = useTheme()

	return (
		<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
			<Container
				maxWidth={false}
				style={{
					padding: '0',
					minHeight: '100vh',
					backgroundColor: theme.palette.background.default,
				}}
			>
				<Router>
					<Navbar />
					<Alerts />
					<Route exact path="/">
						<Landing />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<PrivateRoute path="/dashboard">
						<Dashboard />
					</PrivateRoute>
					<PrivateRoute path="/plantMonitor">
						<PlantMonitor />
					</PrivateRoute>
				</Router>
			</Container>
		</ThemeProvider>
	)
}

export default App
