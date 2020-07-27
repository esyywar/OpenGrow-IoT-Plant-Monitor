import React, { Fragment } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Container } from '@material-ui/core'

import PrivateRoute from './components/util/PrivateRoute'

import Alerts from './components/util/Alerts'
import Navbar from './components/navigation/Navbar'
import Landing from './components/landing/Landing'
import Login from './components/userForms/Login'

import Dashboard from './components/dashboard/Dashboard'

function App() {
	return (
		<Fragment>
			<Container maxWidth={false} style={{ padding: '0', minHeight: '100vh' }}>
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
				</Router>
			</Container>
		</Fragment>
	)
}

export default App
