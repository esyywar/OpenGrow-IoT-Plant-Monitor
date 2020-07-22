import React, { Fragment } from 'react'

import { useSelector } from 'react-redux'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Typography } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { IAlertState } from './reducers/alerts'

import Navbar from './components/navigation/Navbar'
import Login from './components/userForms/Login'

function App() {
	const alerts = useSelector((state: IAlertState) => state.alerts)

	return (
		<Fragment>
			<Container maxWidth={false} style={{ padding: '0', minHeight: '100vh' }}>
				<Router>
					<Navbar />
					<Typography
						component="div"
						align="center"
						style={{ backgroundColor: '#F3F8F2', width: '100vw' }}
					></Typography>
					<Route path="/login">
						<Login />
					</Route>
				</Router>
			</Container>
		</Fragment>
	)
}

export default App
