import React, { useEffect } from 'react'

import { useHistory } from 'react-router'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadActivePlant } from '../../actions/activePlant'

import { Container } from '@material-ui/core/'

import PlantNameDisp from './PlantNameDisp'

import '../../css/plantMonitor.css'

export default function PlantMonitor() {
	const dispatch = useDispatch()

	const history = useHistory()

	const activePlantState = useTypedSelector((state) => state.activePlantState)

	/* If actuve plant state is not loaded then try load from local storage */
	useEffect(() => {
		if (activePlantState.activePlant.name === '') {
			dispatch(loadActivePlant(history))
		}
	}, [dispatch, activePlantState, history])

	return (
		<Container maxWidth="lg" className="plant-monitor">
			<PlantNameDisp />
		</Container>
	)
}
