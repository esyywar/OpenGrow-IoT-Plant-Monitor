import React, { useEffect, useState } from 'react'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadCtrlData } from '../../actions/plantControl'

import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import { Grid, Paper, Button } from '@material-ui/core/'

import EditIcon from '@material-ui/icons/Edit'

import UpdateSetpointModal from './Modals/UpdateSetpointModal'
import UpdateToleranceModal from './Modals/UpdateToleranceModal'
import Spinner from '../util/Spinner'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		plantCtrlSettings: {
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(2),
			},
			[theme.breakpoints.up('md')]: {
				marginTop: theme.spacing(3),
			},
		},
		plantCtrlContainer: {
			width: '100%',
			maxWidth: '550px',
			padding: '30px 10px 20px 20px',
			fontFamily: "'Mulish', sans-serif",
		},
		soilMoisTitle: {
			fontSize: '25px',
			marginBottom: '28px',
		},
		ctrlSettingContainer: {
			marginBottom: '6px',
			width: '100%',
		},
		ctrlSettingText: {
			textAlign: 'center',
			fontSize: '20px',
			fontWeight: 600,
		},
		ctrlValue: {
			padding: 6,
			backgroundColor: theme.palette.background.default,
			borderRadius: '8px',
		},
	})
)

export default function PlantCtrlSettings() {
	const dispatch = useDispatch()

	const theme = useTheme()

	const classes = useStyles()

	const activePlant = useTypedSelector((state) => state.activePlantState.activePlant)

	const plantCtrlState = useTypedSelector((state) => state.plantControlState)

	/* Load plant's control data */
	useEffect(() => {
		if (activePlant.plantId !== '') {
			dispatch(loadCtrlData(activePlant.plantId))
		}
	}, [dispatch, activePlant])

	/* State to open/close modal windows */
	const [setpointModal, setSetpointModal] = useState(false)
	const [toleranceModal, setToleranceModal] = useState(false)

	return (
		<Grid
			container
			direction="column"
			justify="flex-start"
			alignItems="flex-start"
			className={classes.plantCtrlSettings}
		>
			{plantCtrlState.isLoading ? (
				<Spinner />
			) : (
				<Paper
					style={{ backgroundColor: theme.palette.primary.light }}
					className={classes.plantCtrlContainer}
				>
					<h3 className={classes.soilMoisTitle}>Soil Moisture Controls</h3>
					<Grid
						item
						container
						xs={12}
						spacing={5}
						direction="row"
						justify="flex-start"
						alignItems="center"
						className={classes.ctrlSettingContainer}
					>
						<Grid item xs={5} lg={5}>
							<h4 className={classes.ctrlSettingText}>Setpoint:</h4>
						</Grid>
						<Grid item xs={4} lg={3}>
							<h4 className={`${classes.ctrlSettingText} ${classes.ctrlValue}`}>
								{plantCtrlState.control.soilMoisture.setpoint}
							</h4>
						</Grid>
						<Grid item xs={1}>
							<Button onClick={() => setSetpointModal(true)}>
								<EditIcon />
							</Button>
						</Grid>
					</Grid>
					<Grid
						item
						container
						xs={12}
						spacing={5}
						direction="row"
						justify="flex-start"
						alignItems="center"
						className={classes.ctrlSettingContainer}
					>
						<Grid item xs={5} lg={5}>
							<h4 className={classes.ctrlSettingText}>Tolerance:</h4>
						</Grid>
						<Grid item xs={4} lg={3}>
							<h4 className={`${classes.ctrlSettingText} ${classes.ctrlValue}`}>
								{plantCtrlState.control.soilMoisture.tolerance}
							</h4>
						</Grid>
						<Grid item xs={1}>
							<Button onClick={() => setToleranceModal(true)}>
								<EditIcon />
							</Button>
						</Grid>
					</Grid>

					<UpdateSetpointModal isOpen={setpointModal} handleClose={() => setSetpointModal(false)} />

					<UpdateToleranceModal
						isOpen={toleranceModal}
						handleClose={() => setToleranceModal(false)}
					/>
				</Paper>
			)}
		</Grid>
	)
}
