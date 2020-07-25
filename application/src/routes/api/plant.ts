import express, { Request, Response } from 'express'

import config from 'config'

import { check, validationResult } from 'express-validator'

import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'
import adminAuth from '../../middleware/adminAuth'

const router = express.Router()

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
				return res.status(401).json({ msg: 'Plant not found.' })
			}

			if (setpoint < 0 || tolerance < 0) {
				res.status(401).json({ msg: 'Setpoints must be positive values.' })
			}

			plant.control.soilMoisture.setpoint = setpoint
			plant.control.soilMoisture.tolerance = tolerance

			await plant.save()

			res.json({ plant })
		} catch (error) {
			res.status(500).json({ msg: 'Server error.' })
		}
	}
)

/*
 *	Brief: Change soil moisture setpoint for a plant
 *	Path: /api/plant/setpoint/:plantId
 */
router.post(
	'/setpoint/:plantId',
	[check('setpoint', 'Setpoint is required.').isNumeric(), auth],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const plantId = req.params.plantId
		const setpoint = req.body.setpoint

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ msg: 'Plant not found.' })
			}

			if (setpoint < 0) {
				res.status(401).json({ msg: 'Setpoints must be positive values.' })
			}

			plant.control.soilMoisture.setpoint = setpoint

			await plant.save()

			res.json({ plant })
		} catch (error) {
			res.status(500).json({ msg: 'Server error.' })
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

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ msg: 'Plant not found.' })
			}

			if (tolerance < 0) {
				res.status(401).json({ msg: 'Setpoints must be positive values.' })
			}

			plant.control.soilMoisture.tolerance = tolerance

			await plant.save()

			res.json({ plant })
		} catch (error) {
			res.status(500).json({ msg: 'Server error.' })
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
		res.status(500).json({ msg: 'Server error.' })
	}
})

export = router
