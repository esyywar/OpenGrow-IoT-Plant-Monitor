import React from 'react'

import PropTypes, { InferProps } from 'prop-types'

export default function PlantMonitor({ plantId, name }: InferProps<typeof PlantMonitor.propTypes>) {
	return (
		<div>
			Welcome to plant {name} with id: {plantId}
		</div>
	)
}

PlantMonitor.propTypes = {
	plantId: PropTypes.string,
	name: PropTypes.string,
}
