import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useTypedSelector } from '../../../reducers'

import { useDispatch } from 'react-redux'
import { updateTolerance } from '../../../actions/plantControl'

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	TextField,
	Button,
} from '@material-ui/core/'

type ToleranceForm = {
	tolerance: number
}

export default function UpdateSetpointModal({
	isOpen,
	handleClose,
}: InferProps<typeof UpdateSetpointModal.propTypes>) {
	const dispatch = useDispatch()

	/* Need plantId to update tolerance */
	const plantId = useTypedSelector((state) => state.activePlantState.activePlant.plantId)
	const currTolerance = useTypedSelector(
		(state) => state.plantControlState.control.soilMoisture.tolerance
	)

	const initialState: ToleranceForm = { tolerance: currTolerance }

	const [formData, setFormData] = useState<ToleranceForm>(initialState)

	function handleInputChange(event: any) {
		setFormData({ ...formData, [event.target.name]: event.target.value })
	}

	function submitNameChange() {
		dispatch(updateTolerance({ plantId, tolerance: formData.tolerance }))
		handleClose()
	}

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			aria-labelledby="update-tolerance-modal"
			aria-describedby="form-to-update-soil-moisture-tolerance"
			fullWidth
		>
			<DialogTitle id="form-dialog-title">Update Soil Moisture Tolerance</DialogTitle>
			<DialogContent>
				<DialogContentText>
					How far should soil moisture deviate from the setpoint?
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Plant Name"
					type="text"
					name="tolerance"
					placeholder={`${currTolerance}`}
					fullWidth
					onChange={handleInputChange}
					required
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={submitNameChange} color="primary" type="submit">
					Update Tolerance
				</Button>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

UpdateSetpointModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
}
