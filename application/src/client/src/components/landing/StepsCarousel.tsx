import React, { useState } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { MobileStepper, Paper, Typography, Button } from '@material-ui/core/'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'

const howItWorksSteps = [
	{
		stepNum: 1,
		text:
			'Set up your OttoGrow unit with your plant. Fill the water container and place the motor inside.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'Plant with OttoGrow sensors.',
	},
	{
		stepNum: 2,
		text: 'Go to ottogrow.com and sign-up for an account.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'OttoGrow website.',
	},
	{
		stepNum: 3,
		text: "Enter your OttoGrow unit's code to register it to your account.",
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'OttoGrow product code.',
	},
	{
		stepNum: 4,
		text: 'Choose your soil moisture setpoint and update your OttoGrow unit.',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'User setpoint dashboard.',
	},
	{
		stepNum: 5,
		text: 'Watch your plant flourish and adjust setpoints anytime from anywhere!',
		img: require('../../media/randoGoat.jpg'),
		imgAlt: 'User updating remotely.',
	},
]

export default function StepsCarousel() {
	const theme = useTheme()

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
		<Paper className="carousel-container">
			<SwipeableViews
				className="carousel-swipe-container"
				axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
				index={activeStep}
				onChangeIndex={handleStepChange}
				enableMouseEvents
			>
				{howItWorksSteps.map((step, index) => (
					<div className="carousel-step-item" key={step.stepNum}>
						<Typography>
							<div className="text-container">
								<span className="step-number">{`${step.stepNum}. `}</span>
								<span className="step-text">{step.text}</span>
							</div>
						</Typography>
						{Math.abs(activeStep - index) <= 2 ? (
							<img className="carousel-img" src={step.img} alt={step.imgAlt} />
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
