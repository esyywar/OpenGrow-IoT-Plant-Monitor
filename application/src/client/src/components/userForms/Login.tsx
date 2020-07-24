import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { userLogin } from '../../actions/auth'

import { useTheme } from '@material-ui/core/styles'

import { Paper, Container, Grid, Button, TextField } from '@material-ui/core/'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

import '../../css/loginForm.css'

type InputForm = {
	email: string
	password: string
}

export default function Login() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const initialState: InputForm = { email: '', password: '' }

	const [formData, setFormData] = useState<InputForm>(initialState)

	function handleInputChange(event: any) {
		setFormData({ ...formData, [event.target.name]: event.target.value })
	}

	function handleSubmit(event: any) {
		event.preventDefault()
		dispatch(userLogin(formData))
	}

	return (
		<Container maxWidth="sm" style={{ marginTop: '5%' }}>
			<Paper
				className="login-form-container"
				style={{ backgroundColor: theme.palette.secondary.light }}
			>
				<Grid container direction="column" alignItems="center" justify="center">
					<Grid item xs={12} className="login-form-title">
						Login
					</Grid>
					<form className="login-form">
						<Grid item xs={12}>
							<TextField
								required
								id="Email"
								type="text"
								name="email"
								autoFocus
								placeholder="Email"
								onChange={handleInputChange}
								className="input-field"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="Password"
								type="password"
								name="password"
								placeholder="Password"
								onChange={handleInputChange}
								className="input-field"
							/>
						</Grid>
						<Grid item container>
							<Grid item xs={6}>
								<Button
									variant="contained"
									color="primary"
									endIcon={<AccountCircleIcon />}
									onClick={handleSubmit}
								>
									Login
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button variant="contained" color="secondary">
									Register
								</Button>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Paper>
		</Container>
	)
}
