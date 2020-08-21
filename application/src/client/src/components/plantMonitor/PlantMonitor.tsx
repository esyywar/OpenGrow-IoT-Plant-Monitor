import React, { useEffect } from 'react'

import { useHistory } from 'react-router'

import { useTypedSelector } from '../../reducers'
import { useDispatch } from 'react-redux'
import { loadActivePlant } from '../../actions/activePlant'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Container } from '@material-ui/core/'

import PlantNameDisp from './PlantNameDisp'
import PlantCtrlSettings from './PlantCtrlSettings'
import PlantDataPlot from './PlantDataPlot'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		plantMonitor: {
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(6),
			},
			[theme.breakpoints.up('md')]: {
				marginTop: theme.spacing(8),
			},
			paddingBottom: theme.spacing(4),
		},
	})
)

export default function PlantMonitor() {
	const dispatch = useDispatch()

	const history = useHistory()

	const classes = useStyles()

	const activePlantState = useTypedSelector((state) => state.activePlantState)

	/* If active plant state is not loaded then try loading from plantId in local storage */
	useEffect(() => {
		if (activePlantState.activePlant.plantId === '') {
			dispatch(loadActivePlant(history))
		}
		// eslint-disable-next-line
	}, [dispatch])

	return (
		<Container maxWidth="lg" className={classes.plantMonitor}>
			<PlantNameDisp />
			<PlantCtrlSettings />
			<PlantDataPlot />
		</Container>
	)
}
