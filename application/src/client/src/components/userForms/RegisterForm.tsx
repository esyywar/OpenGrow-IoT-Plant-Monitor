import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { registerUser } from '../../actions/auth'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'

import { Paper, Grid, Button, TextField } from '@material-ui/core/'

import CreateIcon from '@material-ui/icons/Create'

type InputForm = {
	username: string
	email: string
	password: string
	passwordConfirm: string
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		registerFormContainer: {
			padding: 40,
		},
		registerFormTitle: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: '28px',
			textAlign: 'center',
			fontWeight: 600,
			textTransform: 'uppercase',
			marginBottom: 10,
		},
		inputField: {
			marginBottom: '15px',
			[theme.breakpoints.up('md')]: {
				minWidth: '250px',
			},
		},
	})
)

export default function RegisterForm() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

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
			className={classes.registerFormContainer}
			style={{ backgroundColor: theme.palette.primary.light }}
		>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12} className={classes.registerFormTitle}>
					Register
				</Grid>
				<form className="login-form">
					<Grid item xs={12}>
						<TextField
							required
							id="register-username"
							type="text"
							name="username"
							placeholder="Username"
							onChange={handleInputChange}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							id="register-email"
							type="text"
							name="email"
							placeholder="Email"
							onChange={handleInputChange}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							id="register-password"
							type="password"
							name="password"
							placeholder="Password"
							onChange={handleInputChange}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							id="register-password2"
							type="password"
							name="passwordConfirm"
							placeholder="Confirm Password"
							onChange={handleInputChange}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={6}>
						<Button
							style={{ marginTop: '8px' }}
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
