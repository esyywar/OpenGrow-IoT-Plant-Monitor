import React, { useState } from 'react'

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'

import { MobileStepper, Paper, Typography, Button } from '@material-ui/core/'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		carouselStep: {
			width: '100%',
			display: 'flex',
			flexFlow: 'row wrap',
			alignItems: 'center',
			justifyContent: 'center',
		},
		textContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			padding: '10px 14px',
			width: '100%',
		},
		stepNumber: {
			padding: '5px 9px',
			marginRight: theme.spacing(2),
			backgroundColor: '#3C4CDF',
			borderRadius: '20px',
			color: 'white',
			fontSize: '19px',
			bordeRadius: '50%',
		},
		stepText: {
			fontFamily: "'Mulish', sans-serif",
			[theme.breakpoints.down('sm')]: {
				fontSize: '17px',
			},
			[theme.breakpoints.up('md')]: {
				fontSize: '19px',
			},
			[theme.breakpoints.up('lg')]: {
				fontSize: '20px',
			},
		},
		carouselImg: {
			display: 'block',
			margin: 'auto',
			width: 'auto',
		},
	})
)

const howItWorksSteps = [
	{
		stepNum: 1,
		text: 'Set-up your MongoDB database and put the connection string in your config file.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'MongoDB setup.',
	},
	{
		stepNum: 2,
		text:
			"Start up the OpenGrow application and create a plant using Postman. Note the plant's ID!",
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'Create plant with postman.',
	},
	{
		stepNum: 3,
		text:
			'Flash the ESP8266 firmware with appropriate Wifi, plant ID and server IP address credentials.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'Flash the ESP8266 firmware.',
	},
	{
		stepNum: 4,
		text: 'Flash the STM32 firmware to a STM32F4 series board such as the STM32F446RE Nucleo.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'Flash the STM32 firmware',
	},
	{
		stepNum: 5,
		text:
			'Start up the OpenGrow service and leave it running to collect data and control your plant!',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'Run OpenGrow.',
	},
]

export default function StepsCarousel() {
	const theme = useTheme()

	const classes = useStyles()

	const [activeStep, setActiveStep] = useState(0)
	const maxSteps = howItWorksSteps.length

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleStepChange = (step: number) => {
		setActiveStep(step)
	}

	return (
		<Paper style={{ backgroundColor: theme.palette.background.paper }}>
			<SwipeableViews
				axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
				index={activeStep}
				onChangeIndex={handleStepChange}
				enableMouseEvents
			>
				{howItWorksSteps.map((step, index) => (
					<div className={classes.carouselStep} key={step.stepNum}>
						<div className={classes.textContainer}>
							<Typography>
								<span className={classes.stepNumber}>{`${step.stepNum}. `}</span>
								<span className={classes.stepText}>{step.text}</span>
							</Typography>
						</div>
						{Math.abs(activeStep - index) <= 2 ? (
							<img className={classes.carouselImg} src={step.img} alt={step.imgAlt} />
						) : null}
					</div>
				))}
			</SwipeableViews>

			<MobileStepper
				steps={maxSteps}
				position="static"
				variant="text"
				activeStep={activeStep}
				nextButton={
					<Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
						Next
						{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
					</Button>
				}
				backButton={
					<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
						{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
						Back
					</Button>
				}
			/>
		</Paper>
	)
}
