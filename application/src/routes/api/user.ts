import express, { Request, Response } from 'express'

import config from 'config'

import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'

import jwt from 'jsonwebtoken'

import User, { IUser } from '../../models/User'
import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'
import { stringify } from 'querystring'

const router = express.Router()

/*******************************************************
 ******************** GET Requests *********************
 ******************************************************/

/*
 *	Brief: Get plants associated with user
 *	Path: /api/user
 */

/*******************************************************
 ******************** POST Requests ********************
 ******************************************************/

/*
 *	Brief: Registering a new user
 *	Path: /api/user
 */
router.post(
	'/',
	[
		check('username', 'Username is required.').notEmpty(),
		check('email', 'Please include a valid email.').isEmail(),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters long.')
			.matches(/\d/)
			.withMessage('Password must contain a number.'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		/* Extract from reqest */
		const { username, email, password } = req.body

		try {
			/* Check if user is already registered */
			const isUser: IUser | null = await User.findOne({ email })

			if (isUser) {
				return res.status(400).json({ errors: [{ msg: 'User already exists.' }] })
			}

			let user: IUser = new User({ email, username })

			user.password = await bcrypt.hash(password, 10)

			await user.save()

			const payload = {
				user: {
					id: user.id,
				},
			}

			/* Generate and return JWT */
			jwt.sign(
				payload,
				config.get('jwt.jwtSecret'),
				{ expiresIn: config.get('jwt.expiresIn') },
				(err, token) => {
					if (err) {
						throw err
					}
					res.json({ token, user: user.id, msg: `You are signed up, ${user.username}!` })
				}
			)
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*
 *	Brief: User log in
 *	Path: /api/user/login
 */
router.post(
	'/login',
	[
		check('email', 'Email is required.').notEmpty(),
		check('password', 'Password is required.').notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body

		try {
			const user: IUser | null = await User.findOne({ email })

			/* Checking if user exists */
			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'Invalid login credentials' }] })
			}

			let isValid = bcrypt.compare(password, user.password)

			if (!isValid) {
				return res.status(400).json({ errors: [{ msg: 'Invalid login credentials.' }] })
			}

			const payload = {
				user: {
					id: user.id,
				},
			}

			jwt.sign(
				payload,
				config.get('jwt.jwtSecret'),
				{ expiresIn: config.get('jwt.expiresIn') },
				(err, token) => {
					if (err) {
						throw err
					}

					res.json({ token, user: user.id, msg: `Welcome back, ${user.username}!` })
				}
			)
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*******************************************************
 ********************* PUT Requests ********************
 ******************************************************/

/*
 *	Brief: Add a plant to user's profile (maximum 10 per user)
 *	Path: /api/user/plant/:id
 */
router.put('/plant/:plantId', auth, async (req: Request, res: Response) => {
	const plantId = req.params.plantId

	try {
		/* Verify that plant exists */
		const plant: IPlant | null = await Plant.findById(plantId)

		if (!plant) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Plant not found. Please check the ID is entered correctly.' }] })
		}

		/* Get user */
		const user: IUser | null = await User.findById(req.body.user.id)
		const plants: Array<{ name?: string; plant: string }> | undefined = user?.plants

		if (plants && plants.length > 10) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'You already have 10 plants on your account!' }] })
		}

		/* Check if user already has this plant added */
		if (user?.plants.some((element: any) => element.plant.toString() === plantId.toString())) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'This plant is already associated with your account!' }] })
		}

		/* Add new plant to user's plant list */
		user?.plants.unshift({ plant: plantId })

		await user?.save()

		res.json({ plants: user?.plants })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*******************************************************
 ******************* DELETE Requests *******************
 ******************************************************/

/*
 *	Brief: Remove plant to user's profile
 *	Path: /api/user/plant/:id
 */
router.delete('/plant/:plantId', auth, async (req: Request, res: Response) => {
	const plantId = req.params.plantId

	try {
		/* Verify that plant exists */
		const plant: IPlant | null = await Plant.findById(plantId)

		if (!plant) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Plant not found. Please check the ID is entered correctly.' }] })
		}

		/* Get user */
		const user: IUser | null = await User.findById(req.body.user.id)

		/* Remove plant ID from user's profile */
		const removeIndex: any = user?.plants.map((plant: any) => plant.plant).indexOf(plantId)
		user?.plants.splice(removeIndex, 1)

		await user?.save()

		res.json({ plants: user?.plants })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

export = router
