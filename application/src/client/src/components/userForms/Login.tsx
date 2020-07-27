import React from 'react'

import { Container, Grid } from '@material-ui/core/'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function Login() {
	return (
		<Container maxWidth="lg" style={{ marginTop: '5%' }}>
			<Grid container direction="row" justify="space-around" alignItems="flex-start" spacing={10}>
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
