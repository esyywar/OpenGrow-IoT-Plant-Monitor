import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { clearActivePlant } from '../../actions/activePlant'
import { clearCtrlData } from '../../actions/plantControl'

import { Container } from '@material-ui/core/'

import UserWelcome from './UserWelcome'
import DashActions from './DashActions'
import UserPlantList from './UserPlantList'

import '../../css/dashboard.css'

export default function Dashboard() {
	const dispatch = useDispatch()

	/* Clear active plant name from state allowing user to select */
	useEffect(() => {
		/* TODO move these actions to a seperate and single action */
		dispatch(clearActivePlant())
		dispatch(clearCtrlData())
	}, [dispatch])

	return (
		<Container maxWidth="lg" className="dashboard">
			<UserWelcome />
			<DashActions />
			<UserPlantList />
		</Container>
	)
}
