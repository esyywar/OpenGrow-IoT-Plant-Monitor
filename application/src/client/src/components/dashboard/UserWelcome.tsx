import React from 'react'

import { useTypedSelector } from '../../reducers'

import { Grid, Paper } from '@material-ui/core/'

import Spinner from '../util/Spinner'

export default function UserWelcome() {
	const auth = useTypedSelector((state) => state.authState.auth)

	return (
		<Grid container>
			{auth.isLoading || auth.username === null ? (
				<Spinner />
			) : (
				<Grid item xs={12} lg={6}>
					<Paper elevation={8} className="dashboard-welcome">
						<h4 className="welcome-text">{`Welcome ${auth.username}`}</h4>
					</Paper>
				</Grid>
			)}
		</Grid>
	)
}
