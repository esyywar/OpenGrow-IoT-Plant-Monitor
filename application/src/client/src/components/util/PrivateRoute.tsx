import React from 'react'

import PropTypes, { InferProps, any } from 'prop-types'

import { useTypedSelector } from '../../reducers'

import { Redirect, Route } from 'react-router-dom'

function PrivateRoute({ children, ...rest }: InferProps<typeof PrivateRoute.propTypes>) {
	const authUser = useTypedSelector((state) => state.authState.auth)

	function canAccess() {
		return authUser.isAuthenticated && !authUser.isLoading
	}

	return (
		<Route
			{...rest}
			render={(routeProps) => (canAccess() ? children : <Redirect to="/login" />)}
		></Route>
	)
}

PrivateRoute.propTypes = {
	children: PropTypes.any,
}

export default PrivateRoute
