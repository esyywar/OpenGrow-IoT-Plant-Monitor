import React from 'react'

import { useTheme } from '@material-ui/core/styles'

import { Grid, Button, Paper } from '@material-ui/core/'

export default function DashActions() {
	const theme = useTheme()

	return (
		<Grid container>
			<Grid
				item
				container
				xs={12}
				lg={5}
				direction="column"
				alignItems="flex-start"
				justify="flex-start"
				className="dash-actions"
			>
				<Paper
					style={{ backgroundColor: theme.palette.primary.light }}
					className="dash-action-container"
				>
					<div className="dash-action-title">Actions</div>
					<Button variant="contained" color="secondary" className="dash-action-btn">
						Add A Plant
					</Button>
				</Paper>
			</Grid>
		</Grid>
	)
}
