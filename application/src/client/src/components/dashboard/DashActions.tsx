import React, { useState } from 'react'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'

import { Grid, Button, Paper } from '@material-ui/core/'

import AddPlantModal from './Modals/AddPlantModal'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		dashActions: {
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(2),
			},
			[theme.breakpoints.up('md')]: {
				marginTop: theme.spacing(3),
			},
		},
		dashActionContainer: {
			width: '100%',
			padding: 20,
		},
		dashActionTitle: {
			fontFamily: "'Mulish', sans-serif",
			fontSize: '30px',
			margin: '10px 0 25px 0',
		},
		dashActionBtn: {
			fontWeight: 600,
		},
	})
)

export default function DashActions() {
	const theme = useTheme()

	const classes = useStyles()

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
				className={classes.dashActions}
			>
				<Paper
					style={{ backgroundColor: theme.palette.primary.light }}
					className={classes.dashActionContainer}
				>
					<div className={classes.dashActionTitle}>Actions</div>
					<Button
						variant="contained"
						color="secondary"
						className={classes.dashActionBtn}
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
