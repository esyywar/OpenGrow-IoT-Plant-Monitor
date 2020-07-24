import React from 'react'

import { useTypedSelector } from '../../reducers'

import AlertMsg from './AlertMsg'

export default function Alerts() {
	const alerts = useTypedSelector((state) => state.alertState.alerts)

	return (
		<div style={{ marginTop: '20px' }}>
			{alerts.length > 0 &&
				alerts.map(({ id, message, type }) => (
					<AlertMsg key={id} id={id} message={message} type={type} />
				))}
		</div>
	)
}
