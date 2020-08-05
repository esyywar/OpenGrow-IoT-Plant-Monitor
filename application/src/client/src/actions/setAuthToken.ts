/* Set the auth token in header to send request */

import axios from 'axios'

export function setAuthToken(token: string) {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token
	} else {
		delete axios.defaults.headers.common['x-auth-token']
	}
}
