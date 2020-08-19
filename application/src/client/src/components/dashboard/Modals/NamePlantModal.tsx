import React, { useState } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useDispatch } from 'react-redux'
import { renameUserPlant } from '../../../actions/userPlants'

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	TextField,
	Button,
} from '@material-ui/core/'

type PlantNameForm = {
	plantId: string
	name: string
}

export default function NamePlantModal({
	plantId,
	currName,
	isOpen,
	handleClose,
}: InferProps<typeof NamePlantModal.propTypes>) {
	const dispatch = useDispatch()

	const initialState: PlantNameForm = { plantId, name: currName }

	const [formData, setFormData] = useState<PlantNameForm>(initialState)

	function handleInputChange(event: any) {
		setFormData({ ...formData, [event.target.name]: event.target.value })
	}

	function submitNameChange() {
		if (formData.name !== currName) {
			dispatch(renameUserPlant(formData))
		}
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
			<DialogTitle id="form-dialog-title">Name Your Plant</DialogTitle>
			<DialogContent>
				<DialogContentText>What do you want to name this plant?</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Plant Name"
					type="text"
					name="name"
					placeholder={currName}
					fullWidth
					onChange={handleInputChange}
					required
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={submitNameChange} color="primary" type="submit">
					Change Name
				</Button>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

NamePlantModal.propTypes = {
	plantId: PropTypes.string.isRequired,
	currName: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
}
