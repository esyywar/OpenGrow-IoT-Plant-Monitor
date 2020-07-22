import React, { Fragment } from 'react'

import { useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Alert } from '@material-ui/lab'

import { IAlertState } from './reducers/alerts'

import Navbar from './components/navigation/Navbar'

function App() {
	const alerts = useSelector((state: IAlertState) => state.alerts)

	return (
		<Fragment>
			<Container maxWidth={false} style={{ padding: '0' }}>
				<Navbar />
				<Typography
					component="div"
					align="center"
					style={{ backgroundColor: '#F3F8F2', height: '100vh', width: '100vw' }}
				></Typography>
			</Container>
		</Fragment>
	)
}

export default App
