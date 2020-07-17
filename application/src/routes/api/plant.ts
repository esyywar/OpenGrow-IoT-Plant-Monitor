import express, { Request, Response } from 'express'

import { check, validationResult } from 'express-validator'

import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'
import adminAuth from '../../middleware/adminAuth'

const router = express.Router()

/*******************************************************
 ******************** POST Requests ********************
 ******************************************************/

/*
 *	Brief: Change upper soil moisture setpoints for plant
 *	Path: /api/plant/setpoint/
 */
router.post(
	'/setpoint/:plantId',
	[
		check('lowerLimit', 'Lower limit is required.').isNumeric(),
		check('upperLimit', 'Upper limit is required.').isNumeric(),
		auth,
	],
	async (req: Request, res: Response) => {
		const plantId = req.params.plantId
		const { upperLim, lowerLim } = req.body

		try {
			const plant: IPlant | null = await Plant.findById(plantId)

			if (!plant) {
				return res.status(401).json({ msg: 'Plant not found.' })
			}

			if (lowerLim < 0 || upperLim < 0) {
				res.status(401).json({ msg: 'Setpoints must be positive values.' })
			}

			plant.setpoints.soilMoisture.lowerLimit = lowerLim
			plant.setpoints.soilMoisture.upperLimit = upperLim

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
router.put('/create', [auth, adminAuth], async (req: Request, res: Response) => {
	const newPlant: IPlant = new Plant()

	newPlant.pubTopic = newPlant.id.concat('_setpoint')

	try {
		/* Save in db - return number of plants and id */
		await newPlant.save()
		let numPlants: number = await Plant.countDocuments()
		res.json({ numPlants, msg: `Plant ${newPlant.id} has been created.` })
	} catch (error) {
		res.status(500).json({ msg: 'Server error.' })
	}
})

export = router
