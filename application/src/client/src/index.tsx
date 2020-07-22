import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './index.css'

import { Provider } from 'react-redux'
import store from './store'

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

/* Creating custom material-ui theme */
const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#CCE8CC',
			main: '#4F772D',
			dark: '#0D1C0D',
		},
		secondary: {
			light: '#A69CAC',
			main: '#474973',
			dark: '#0D0C1D',
		},
	},
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
