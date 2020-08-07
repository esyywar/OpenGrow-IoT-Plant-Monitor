import React from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useDispatch } from 'react-redux'
import { removeUserPlant } from '../../../actions/userPlants'

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide,
} from '@material-ui/core'

import { TransitionProps } from '@material-ui/core/transitions'

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children?: React.ReactElement<any, any> },
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />
})

export default function RemovePlantModal({
	plantId,
	isOpen,
	handleClose,
}: InferProps<typeof RemovePlantModal.propTypes>) {
	const dispatch = useDispatch()

	function removePlant() {
		dispatch(removeUserPlant(plantId))
		handleClose()
	}

	return (
		<Dialog
			open={isOpen}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby="remove-plant-confirmation"
			aria-describedby="confirmation-dialog-to-remove-plant"
		>
			<DialogTitle id="alert-dialog-slide-title">
				{'Remove this plant from your account?'}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					If you remove this plant from your account you will not be able to view data or enable
					soil moisture setpoints.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={removePlant} color="primary">
					Remove Plant
				</Button>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

RemovePlantModal.propTypes = {
	plantId: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
}
