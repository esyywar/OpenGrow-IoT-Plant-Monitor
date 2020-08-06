import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { loadUser } from '../../actions/auth'

import { useTypedSelector } from '../../reducers'

import { Redirect, Route, RouteProps } from 'react-router-dom'

interface PrivateRouteProps extends RouteProps {
	// tslint:disable-next-line:no-any
	component?: any
	// tslint:disable-next-line:no-any
	children: any
	// tslint:disable-next-line:no-any
	path: any
}

function PrivateRoute(props: PrivateRouteProps) {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(loadUser())
	}, [dispatch])

	const authUser = useTypedSelector((state) => state.authState.auth)

	const { component: Component, children, ...rest } = props

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

export default PrivateRoute
