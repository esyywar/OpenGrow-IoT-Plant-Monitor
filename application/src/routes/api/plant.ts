import express, { Request, Response } from 'express'

import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'
import adminAuth from '../../middleware/adminAuth'

const router = express.Router()

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
