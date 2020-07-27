import React from 'react'

import { useTypedSelector } from '../../reducers'

import { Redirect } from 'react-router-dom'

import { Container, Grid } from '@material-ui/core/'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function Login() {
	const authState = useTypedSelector((state) => state.authState.auth)

	if (authState.isAuthenticated) {
		return <Redirect to="/dashboard" />
	}

	return (
		<Container maxWidth="lg" style={{ marginTop: '5%' }}>
			<Grid container direction="row" justify="space-around" alignItems="flex-start" spacing={7}>
				<Grid item xs={12} sm={8} lg={6}>
					<LoginForm />
				</Grid>
				<Grid item xs={12} sm={8} lg={6}>
					<RegisterForm />
				</Grid>
			</Grid>
		</Container>
	)
}
