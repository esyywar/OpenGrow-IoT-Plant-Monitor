import React, { useState, useRef } from 'react'

import PropTypes, { InferProps } from 'prop-types'

import { ResponsiveLine } from '@nivo/line'

import RefreshIcon from '@material-ui/icons/Refresh'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import {
	useTheme,
	Theme,
	Grid,
	Typography,
	Paper,
	Button,
	MenuList,
	MenuItem,
	Popper,
	Grow,
	ClickAwayListener,
} from '@material-ui/core/'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		titleRoot: {
			fontFamily: "'Mulish', sans-seif",
			marginTop: 10,
			fontSize: 30,
			fontWeight: 600,
		},
		chartRoot: {
			width: '100%',
			height: 500,
			padding: theme.spacing(2),
			color: theme.palette.text.primary,
		},
		actionButton: {
			marginRight: 25,
		},
		toolTip: {
			border: '2px solid ' + theme.palette.secondary.main,
			borderRadius: theme.spacing(2),
			padding: theme.spacing(2),
			fontFamily: "'Mulish', sans-serif",
			fontSize: 14,
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text.primary,
			fontWeight: 'bold',
			boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
			marginBottom: theme.spacing(2),
		},
	})
)

export default function LinePlot({ dataId, data }: InferProps<typeof LinePlot.propTypes>) {
	/* Toggle collapsable time-scale menu */
	const [isMenuOpen, setMenuOpen] = useState(false)

	const anchorRef = useRef(null)

	const handleClose = (event: any) => {
		setMenuOpen(false)
	}

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault()
			setMenuOpen(false)
		}
	}

	// return focus to the button when we transitioned from !isMenuOpen -> isMenuOpen
	const prevOpen = useRef(isMenuOpen)
	React.useEffect(() => {
		if (prevOpen !== null) {
			prevOpen.current = isMenuOpen
		}
	}, [isMenuOpen])

	/* Hover effect for chart */
	const [isHover, setHover] = useState(false)

	const theme = useTheme()

	const classes = useStyles()

	return (
		<Grid item container xs={12} direction="column" alignItems="center" justify="flex-start">
			<Paper
				style={{
					width: '100%',
					backgroundColor: theme.palette.background.paper,
					borderWidth: '4px',
					borderStyle: 'solid',
					borderColor: isHover ? theme.palette.secondary.light : theme.palette.secondary.main,
					padding: '10px',
				}}
			>
				<Grid item xs={12}>
					<Typography align="center" variant="h5" className={classes.titleRoot}>
						{dataId}
					</Typography>
				</Grid>

				<Grid
					item
					container
					xs={12}
					direction="row"
					alignItems="center"
					justify="flex-start"
					style={{ margin: '10px 20px' }}
				>
					<Button
						startIcon={<RefreshIcon />}
						color="secondary"
						variant="contained"
						className={classes.actionButton}
					>
						{' '}
						<Typography align="center" variant="body2">
							Refresh Data
						</Typography>
					</Button>

					<Button
						startIcon={<ArrowDropDownIcon />}
						color="secondary"
						variant="contained"
						onClick={() => setMenuOpen(!isMenuOpen)}
						className={classes.actionButton}
						ref={anchorRef}
					>
						<Typography align="center" variant="body2">
							Test Drop Down
						</Typography>
					</Button>
					<Popper
						open={isMenuOpen}
						anchorEl={anchorRef.current}
						role={undefined}
						transition
						disablePortal
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps} style={{ transformOrigin: 'bottom' }}>
								<Paper>
									<ClickAwayListener onClickAway={handleClose}>
										<MenuList
											autoFocusItem={isMenuOpen}
											id="menu-list-grow"
											onKeyDown={handleListKeyDown}
										>
											<MenuItem onClick={handleClose}>Hours</MenuItem>
											<MenuItem onClick={handleClose}>Days</MenuItem>
											<MenuItem onClick={handleClose}>Weeks</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</Grid>

				<Grid item xs={12} className={classes.chartRoot}>
					<ResponsiveLine
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						data={[{ id: dataId, data }]}
						lineWidth={4}
						pointSize={10}
						curve={'monotoneX'}
						enableGridY={true}
						enableGridX={true}
						colors={isHover ? theme.palette.text.primary : theme.palette.text.secondary}
						margin={{ top: 10, right: 110, bottom: 100, left: 100 }}
						xScale={{ format: '%m-%d-%Y-%H-%M-%S', type: 'time' }}
						xFormat="time:%m-%d-%Y-%H-%M-%S"
						yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
						axisTop={null}
						axisRight={null}
						axisBottom={{
							orient: 'bottom',
							format: '%m-%d',
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							tickValues: 'every 1 hour',
							legend: 'Time',
							legendOffset: 50,
							legendPosition: 'middle',
						}}
						axisLeft={{
							orient: 'left',
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: dataId,
							legendOffset: -70,
							legendPosition: 'middle',
						}}
						useMesh={true}
						theme={{
							grid: {
								line: {
									stroke: theme.palette.text.primary,
								},
							},
							axis: {
								legend: {
									text: {
										fill: theme.palette.text.primary,
										fontSize: 20,
									},
								},
								ticks: {
									text: {
										fill: theme.palette.text.primary,
										fontSize: 14,
									},
									line: {
										stroke: theme.palette.text.primary,
										strokeWidth: 1,
									},
								},
								domain: {
									line: {
										stroke: theme.palette.text.primary,
										strokeWidth: 1,
									},
								},
							},
							crosshair: {
								line: {
									stroke: theme.palette.text.primary,
									strokeWidth: 1,
									strokeOpacity: 0.35,
								},
							},
						}}
						tooltip={({ point }) => {
							return (
								<div className={classes.toolTip}>
									<p>{point.data.x.toString()}</p>
									<p>{`${dataId}: ${point.data.y}`}</p>
								</div>
							)
						}}
					/>
				</Grid>
			</Paper>
		</Grid>
	)
}

LinePlot.propTypes = {
	dataId: PropTypes.string.isRequired,
	data: {
		x: PropTypes.number.isRequired,
		y: PropTypes.instanceOf(Date).isRequired,
	},
}
