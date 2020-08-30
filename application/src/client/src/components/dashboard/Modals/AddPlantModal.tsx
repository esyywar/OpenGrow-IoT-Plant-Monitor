import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useDispatch } from 'react-redux'
import { addUserPlant } from '../../../actions/userPlants'

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	TextField,
	Button,
	Typography,
} from '@material-ui/core/'

type AddPlantForm = {
	plantId: string
}

export default function NamePlantModal({
	isOpen,
	handleClose,
}: InferProps<typeof NamePlantModal.propTypes>) {
	const dispatch = useDispatch()

	const initialState: AddPlantForm = { plantId: '' }

	const [formData, setFormData] = useState<AddPlantForm>(initialState)

	function handleInputChange(event: any) {
		setFormData({ ...formData, [event.target.name]: event.target.value })
	}

	function submitNameChange() {
		dispatch(addUserPlant(formData.plantId))
		handleClose()
	}

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			aria-labelledby="name-plant-modal"
			aria-describedby="form-for-naming-plant"
			fullWidth
		>
			<DialogTitle id="form-dialog-title">Add A Plant</DialogTitle>
			<DialogContent>
				<DialogContentText>What is the ID number of the plant?</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Plant Name"
					type="text"
					name="plantId"
					color="primary"
					placeholder="Enter 24 character ID code"
					fullWidth
					onChange={handleInputChange}
					required
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={submitNameChange} color="primary" type="submit">
					<Typography color="textSecondary">Add Plant</Typography>
				</Button>
				<Button onClick={handleClose} color="primary">
					<Typography color="textSecondary">Cancel</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	)
}

NamePlantModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
}
