import React from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { SwipeableDrawer, List, ListItem, ListItemIcon } from '@material-ui/core'

export default function NavDrawer({
	isOpen,
	onOpen,
	onClose,
}: InferProps<typeof NavDrawer.propTypes>) {
	return (
		<SwipeableDrawer anchor="left" open={isOpen} onOpen={onOpen} onClose={onClose}>
			I am Open
		</SwipeableDrawer>
	)
}

NavDrawer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onOpen: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
}
