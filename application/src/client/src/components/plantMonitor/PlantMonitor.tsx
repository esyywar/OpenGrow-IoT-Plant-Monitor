import React from 'react'

import { Container } from '@material-ui/core/'

import PlantNameDisp from './PlantNameDisp'

import '../../css/plantMonitor.css'

export default function PlantMonitor() {
	return (
		<Container maxWidth="lg" className="plant-monitor">
			<PlantNameDisp />
		</Container>
	)
}
