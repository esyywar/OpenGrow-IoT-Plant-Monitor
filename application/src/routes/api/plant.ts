import express, { Request, Response } from 'express'

import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'

const router = express.Router()

/*******************************************************
 ******************** PUT Requests *********************
 ******************************************************/

/*
 *	Brief: Create a new blank plant entry and return ID
 *	Path: /api/plant/create
 */
router.put('/create', async (req: Request, res: Response) => {
	const newPlant: IPlant = new Plant()

	newPlant.pubTopic = newPlant.id.concat('_pubTopic')

	try {
		await newPlant.save()
		res.json({ msg: `Plant ${newPlant.id} has been created.` })
	} catch (error) {
		res.status(500).json({ msg: 'Server error.' })
	}
})

export = router
