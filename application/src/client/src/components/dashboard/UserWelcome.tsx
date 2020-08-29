import React from 'react'

import { useTypedSelector } from '../../reducers'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Grid, Paper } from '@material-ui/core/'

import Spinner from '../util/Spinner'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		dashboardWelcome: {
			backgroundColor: theme.palette.secondary.light,
			padding: '15px',
			marginBottom: 35,
		},
		welcomeText: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: 30,
		},
	})
)

export default function UserWelcome() {
	const auth = useTypedSelector((state) => state.authState.auth)

	const classes = useStyles()

	return (
		<Grid container>
			{auth.isLoading || auth.username === null ? (
				<Spinner />
			) : (
				<Grid item xs={12} lg={6}>
					<Paper elevation={8} className={classes.dashboardWelcome}>
						<h4 className={classes.welcomeText}>{`Welcome ${auth.username}`}</h4>
					</Paper>
				</Grid>
			)}
		</Grid>
	)
}
