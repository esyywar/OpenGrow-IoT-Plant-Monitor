import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { registerUser } from '../../actions/auth'

import { useTheme } from '@material-ui/core/styles'

import { Paper, Grid, Button, TextField } from '@material-ui/core/'

import CreateIcon from '@material-ui/icons/Create'

type InputForm = {
	username: string
	email: string
	password: string
	passwordConfirm: string
}

export default function RegisterForm() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const initialState: InputForm = { username: '', email: '', password: '', passwordConfirm: '' }

	const [formData, setFormData] = useState<InputForm>(initialState)

	function handleInputChange(event: any) {
		setFormData({ ...formData, [event.target.name]: event.target.value })
	}

	function handleSubmit(event: any) {
		event.preventDefault()
		dispatch(registerUser(formData))
	}
	return (
		<Paper
			className="login-form-container"
			style={{ backgroundColor: theme.palette.primary.light }}
		>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12} className="login-form-title">
					Register
				</Grid>
				<form className="login-form">
					<Grid item xs={12}>
						<TextField
							required
							id="Username"
							type="text"
							name="username"
							placeholder="Username"
							onChange={handleInputChange}
							className="input-field"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							id="Email"
							type="text"
							name="email"
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
					<Grid item xs={12}>
						<TextField
							required
							id="Password"
							type="password"
							name="passwordConfirm"
							placeholder="Confirm Password"
							onChange={handleInputChange}
							className="input-field"
						/>
					</Grid>
					<Grid item xs={6}>
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							endIcon={<CreateIcon />}
							onClick={handleSubmit}
						>
							Register
						</Button>
					</Grid>
				</form>
			</Grid>
		</Paper>
	)
}
