import React from 'react'

import { Container } from '@material-ui/core/'

import UserWelcome from './UserWelcome'
import DashActions from './DashActions'
import UserPlantList from './UserPlantList'

import '../../css/dashboard.css'

export default function Dashboard() {
	return (
		<Container maxWidth="lg" className="dashboard">
			<UserWelcome />
			<DashActions />
			<UserPlantList />
		</Container>
	)
}
