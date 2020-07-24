import React from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { useDispatch } from 'react-redux'
import { resetAlert } from '../../actions/alerts'

import { Alert } from '@material-ui/lab'

export default function AlertMsg({ id, message, type }: InferProps<typeof AlertMsg.propTypes>) {
	const dispatch = useDispatch()

	return (
		<Alert
			severity={type}
			style={{ margin: '8px 30px' }}
			onClose={() => id && dispatch(resetAlert(id))}
		>
			{message}
		</Alert>
	)
}

AlertMsg.propTypes = {
	id: PropTypes.string,
	message: PropTypes.string,
	type: PropTypes.any,
}
