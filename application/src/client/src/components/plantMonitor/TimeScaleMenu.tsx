import React, { useState, useRef, useEffect } from 'react'

import PropTypes, { InferProps } from 'prop-types'
import { TimeScaleEnum } from './LinePlot'

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import {
	Typography,
	useTheme,
	Paper,
	Button,
	MenuList,
	MenuItem,
	Popper,
	Grow,
	ClickAwayListener,
} from '@material-ui/core/'

export default function TimeScaleMenu({
	currTimeScale,
	onScaleChange,
}: InferProps<typeof TimeScaleMenu.propTypes>) {
	const theme = useTheme()

	/* Toggle collapsable time-scale menu */
	const [isMenuOpen, setMenuOpen] = useState(false)

	const anchorRef = useRef(null)

	const handleClose = (event: React.MouseEvent<Document> | React.MouseEvent<HTMLLIElement>) => {
		setMenuOpen(false)
	}

	const handleMenuChoice = (
		event: React.MouseEvent<HTMLLIElement>,
		newTimeScale: TimeScaleEnum
	) => {
		onScaleChange(newTimeScale)

		handleClose(event)
	}

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault()
			setMenuOpen(false)
		}
	}

	// return focus to the button when we transitioned from !isMenuOpen -> isMenuOpen
	const prevOpen = useRef(isMenuOpen)
	useEffect(() => {
		if (prevOpen !== null) {
			prevOpen.current = isMenuOpen
		}
	}, [isMenuOpen])

	return (
		<Paper style={{ backgroundColor: theme.palette.background.default }}>
			<Button
				color="secondary"
				variant="contained"
				startIcon={<ArrowDropDownIcon />}
				onClick={() => setMenuOpen(!isMenuOpen)}
				ref={anchorRef}
			>
				<Typography variant="body2">{currTimeScale}</Typography>
			</Button>

			<Popper
				open={isMenuOpen}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
				style={{ zIndex: 2 }}
			>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} style={{ transformOrigin: 'bottom' }}>
						<Paper style={{ backgroundColor: theme.palette.background.default }}>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList
									autoFocusItem={isMenuOpen}
									id="menu-list-grow"
									onKeyDown={handleListKeyDown}
								>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Hours)}>
										Hours
									</MenuItem>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Days)}>
										Days
									</MenuItem>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Weeks)}>
										Weeks
									</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</Paper>
	)
}

TimeScaleMenu.propTypes = {
	currTimeScale: PropTypes.string.isRequired,
	onScaleChange: PropTypes.func.isRequired,
}
