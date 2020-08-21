import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { userLogin } from '../../actions/auth'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'

import { Paper, Grid, Button, TextField } from '@material-ui/core/'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

type InputForm = {
	email: string
	password: string
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		loginFormContainer: {
			padding: 40,
		},
		loginFormTitle: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: '28px',
			textAlign: 'center',
			fontWeight: 600,
			textTransform: 'uppercase',
			marginBottom: 10,
		},
		inputField: {
			marginBottom: '15px',
			minWidth: '250px',
		},
	})
)

export default function LoginForm() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

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
		<Paper
			className={classes.loginFormContainer}
			style={{ backgroundColor: theme.palette.secondary.light }}
		>
			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item xs={12} className={classes.loginFormTitle}>
					Login
				</Grid>
				<form>
					<Grid item xs={12}>
						<TextField
							required
							id="Email"
							type="text"
							name="email"
							autoFocus
							placeholder="Email"
							onChange={handleInputChange}
							className={classes.inputField}
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
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={6}>
						<Button
							style={{ marginTop: '8px' }}
							variant="contained"
							color="primary"
							type="submit"
							endIcon={<AccountCircleIcon />}
							onClick={handleSubmit}
						>
							Login
						</Button>
					</Grid>
				</form>
			</Grid>
		</Paper>
	)
}
