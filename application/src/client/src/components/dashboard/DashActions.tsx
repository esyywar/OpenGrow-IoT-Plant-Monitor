import React, { useState } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { Grid, Button, Paper } from '@material-ui/core/'

import AddPlantModal from './Modals/AddPlantModal'

export default function DashActions() {
	const theme = useTheme()

	const [modalOpen, setModalOpen] = useState(false)

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
					<Button
						variant="contained"
						color="secondary"
						className="dash-action-btn"
						onClick={() => setModalOpen(true)}
					>
						Add A Plant
					</Button>
				</Paper>
			</Grid>

			<AddPlantModal isOpen={modalOpen} handleClose={() => setModalOpen(false)} />
		</Grid>
	)
}
