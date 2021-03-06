import React, { useState, useRef, useEffect } from 'react'

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

interface TimeScaleProps {
	currTimeScale: string
	onScaleChange: Function
}

export default function TimeScaleMenu({ currTimeScale, onScaleChange }: TimeScaleProps) {
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
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Hour)}>
										Last Hour
									</MenuItem>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Day)}>
										Last Day
									</MenuItem>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Week)}>
										Last Week
									</MenuItem>
									<MenuItem onClick={(event) => handleMenuChoice(event, TimeScaleEnum.Max)}>
										Max
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
