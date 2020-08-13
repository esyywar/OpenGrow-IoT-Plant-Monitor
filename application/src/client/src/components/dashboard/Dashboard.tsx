import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { clearActivePlant } from '../../actions/activePlant'

import { Container } from '@material-ui/core/'

import UserWelcome from './UserWelcome'
import DashActions from './DashActions'
import UserPlantList from './UserPlantList'

import '../../css/dashboard.css'

export default function Dashboard() {
	const dispatch = useDispatch()

	/*
	 * Clear active plant state and loaded data
	 * -> this is done so user can choose an active plant and data is loaded fresh
	 */
	useEffect(() => {
		dispatch(clearActivePlant())
	}, [dispatch])

	return (
		<Container maxWidth="lg" className="dashboard">
			<UserWelcome />
			<DashActions />
			<UserPlantList />
		</Container>
	)
}
