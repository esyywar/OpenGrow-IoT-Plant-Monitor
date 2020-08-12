import React, { useEffect } from 'react'

import { useHistory } from 'react-router'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadActivePlant } from '../../actions/activePlant'

import { Container } from '@material-ui/core/'

import PlantNameDisp from './PlantNameDisp'
import PlantCtrlSettings from './PlantCtrlSettings'
import PlantDataPlot from './PlantDataPlot'

import '../../css/plantMonitor.css'

export default function PlantMonitor() {
	const dispatch = useDispatch()

	const history = useHistory()

	const activePlantState = useTypedSelector((state) => state.activePlantState)

	/* If active plant state is not loaded then try loading from plantId in local storage */
	useEffect(() => {
		if (activePlantState.activePlant.plantId === '') {
			dispatch(loadActivePlant(history))
		}
		// eslint-disable-next-line
	}, [dispatch])

	return (
		<Container maxWidth="lg" className="plant-monitor">
			<PlantNameDisp />
			<PlantCtrlSettings />
			<PlantDataPlot />
		</Container>
	)
}
