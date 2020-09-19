import express, { Request, Response } from 'express'

import config from 'config'

import { mqttClient } from '../../server'

import { check, validationResult } from 'express-validator'

import Plant, { IPlant } from '../../models/Plant'
import User, { IUser } from '../../models/User'

import auth from '../../middleware/auth'

const router = express.Router()

/*********** CONTROL DATA PACKET INTERFACES **********/

interface IToleranceUpdate {
	tolerance: number
}

interface ISetpointUpdate {
	setpoint: number
}

/*******************************************************
 ******************** GET Requests *********************
 ******************************************************/

/*
 *	Brief: Get soilMoisture and lightLevel data for a plant
 *	Path: /api/plant/data/:plantId
 */
router.get('/data/:plantId', auth, async (req: Request, res: Response) => {
	try {
		const user: IUser | null = await User.findById(req.body.user.id)

		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'User does not exist.' }] })
		}

		const plantId = req.params.plantId

		const plant: IPlant | null = await Plant.findById(plantId)

		/* Verify that plant exists */
		if (!plant) {
			return res.status(401).json({ errors: [{ msg: 'Plant not found.' }] })
		}

		/* Verify that plant is associated with user */
		if (!user.plants.some((item) => item.plant.toString() === plantId)) {
			return res
				.status(401)
				.json({ errors: [{ msg: 'This plant is not associated with your account.' }] })
		}

		/* Return soil moisture and light data without the _id field */
		const soilMoisture = plant.data.soilMoisture.map(({ measurement, date }) => {
			return {
				measurement,
				date,
			}
		})

		const lightLevel = plant.data.lightLevel.map(({ measurement, date }) => {
			return {
				measurement,
				date,
			}
		})

		const plantData = { soilMoisture, lightLevel }

		res.json({ plantData })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*
 *	Brief: Get control data (setpoint and tolerance) for a plant
 *	Path: /api/plant/control/:plantId
 */
router.get('/control/:plantId', auth, async (req: Request, res: Response) => {
	try {
		const user: IUser | null = await User.findById(req.body.user.id)

		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'User does not exist.' }] })
		}

		const plantId = req.params.plantId

		const plant: IPlant | null = await Plant.findById(plantId)

		if (!plant) {
			return res.status(401).json({ errors: [{ msg: 'Plant not found.' }] })
		}

		/* Verify that plant is associated with user */
		if (!user.plants.some((item) => item.plant.toString() === plantId)) {
			return res
				.status(401)
				.json({ errors: [{ msg: 'This plant is not associated with your account.' }] })
		}

		res.json({ control: plant.control })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*******************************************************
 ******************** POST Requests ********************
 ******************************************************/

/*
 *	Brief: Change soil moisture setpoint and tolerance for a plant
 *	Path: /api/plant/control/:plantId
 */
router.post(
	'/control/:plantId',
	[
		check('setpoint', 'Setpoint is required.').isNumeric(),
		check('tolerance', 'Tolerance value is required.').isNumeric(),
		auth,
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const plantId = req.params.plantId
		const { setpoint, tolerance } = req.body

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ errors: [{ msg: 'Plant not found.' }] })
			}

			if (setpoint < 0 || tolerance < 0) {
				return res.status(401).json({ errors: [{ msg: 'Setpoints must be positive values.' }] })
			}

			plant.control.soilMoisture.setpoint = setpoint
			plant.control.soilMoisture.tolerance = tolerance

			await plant.save()

			res.json({ control: plant.control })
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*
 *	Brief: Change soil moisture setpoint for a plant
 *	Path: /api/plant/setpoint/:plantId
 */
router.post(
	'/setpoint/:plantId',
	[check('setpoint', 'Setpoint value is required.').isNumeric(), auth],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const plantId = req.params.plantId
		const setpoint = req.body.setpoint

		/* Publish data to plant */
		const topic = plantId.concat('/soilMoisture/setpoint')

		const data: ISetpointUpdate = {
			setpoint,
		}

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ errors: [{ msg: 'Plant not found.' }] })
			}

			if (setpoint < 0) {
				return res.status(401).json({ errors: [{ msg: 'Setpoints must be positive values.' }] })
			}

			/* Publish control data to ESP subscriber -> Retain in case ESP is offline (msg will be delivered next time ESP connects) */
			mqttClient.publish(topic, JSON.stringify(data), { qos: config.get('mqtt.qos'), retain: true })

			plant.control.soilMoisture.setpoint = setpoint

			await plant.save()

			res.json({ control: plant.control })
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*
 *	Brief: Change soil moisture tolerance for a plant
 *	Path: /api/plant/tolerance/:plantId
 */
router.post(
	'/tolerance/:plantId',
	[check('tolerance', 'Tolerance value is required.').isNumeric(), auth],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const plantId = req.params.plantId
		const tolerance = req.body.tolerance

		/* Publish data to plant */
		const topic = plantId.concat('/soilMoisture/tolerance')

		const data: IToleranceUpdate = {
			tolerance,
		}

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ errors: [{ msg: 'Plant not found.' }] })
			}

			if (tolerance < 100) {
				return res.status(401).json({ errors: [{ msg: 'Tolerance must be at least 100.' }] })
			}

			/* Publish control data to ESP subscriber -> Retain in case ESP is offline (msg will be delivered next time ESP connects) */
			mqttClient.publish(topic, JSON.stringify(data), { qos: config.get('mqtt.qos'), retain: true })

			plant.control.soilMoisture.tolerance = tolerance

			await plant.save()

			res.json({ control: plant.control })
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*******************************************************
 ******************** PUT Requests *********************
 ******************************************************/

/*
 *	Brief: Create a new blank plant entry and return ID
 *	Path: /api/plant/create
 */
router.put('/create', async (req: Request, res: Response) => {
	const newPlant: IPlant = new Plant()

	try {
		/* Save in db - return number of plants and id */
		await newPlant.save()

		const numPlants: number = await Plant.countDocuments()

		res.json({ numPlants, msg: `Plant ${newPlant.id} has been created.` })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

export = router
