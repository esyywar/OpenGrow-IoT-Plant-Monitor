import express, { Request, Response } from 'express'

import config from 'config'

import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'

import jwt from 'jsonwebtoken'

import User, { IUser } from '../../models/User'
import Plant, { IPlant } from '../../models/Plant'

import auth from '../../middleware/auth'

const router = express.Router()

/*******************************************************
 ******************** GET Requests *********************
 ******************************************************/

/*
 *	Brief: Get user username and id from token
 *	Path: /api/user/auth
 */
router.get('/auth', auth, async (req: Request, res: Response) => {
	const token = req.header('x-auth-token')

	try {
		const user: IUser | null = await User.findById(req.body.user.id)

		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'User does not exist.' }] })
		}

		res.json({ token, userId: user.id, username: user.username })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*
 *	Brief: Get all plants associated with the user
 *	Path: /api/user/plants
 */
router.get('/plants', auth, async (req: Request, res: Response) => {
	try {
		const user: IUser | null = await User.findById(req.body.user.id)

		res.json({ plants: user?.plants })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*******************************************************
 ******************** POST Requests ********************
 ******************************************************/

/*
 *	Brief: Registering a new user
 *	Path: /api/user/register
 */
router.post(
	'/register',
	[
		check('username', 'Username is required.').notEmpty(),
		check('email', 'Please include a valid email.').isEmail(),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters long.')
			.matches(/\d/)
			.withMessage('Password must contain a number.'),
		check('passwordConfirm').notEmpty().withMessage('Must provide matching confirmation password.'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		/* Extract from reqest */
		const { email, password, passwordConfirm } = req.body

		/* Check that passwords match */
		if (password !== passwordConfirm) {
			return res.status(400).json({ errors: [{ msg: 'Passwords do not match.' }] })
		}

		/* Capitalize first letter of username */
		const username = req.body.username.charAt(0).toUpperCase() + req.body.username.slice(1)

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
					res.json({ token, userId: user.id, username: user.username })
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

					res.json({ token, userId: user.id, username: user.username })
				}
			)
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error.' }] })
		}
	}
)

/*
 *	Brief: Name plant on a user's profile
 *	Path: /api/user/plant/name/:plantId
 */
router.post(
	'/plant/name/:plantId',
	[check('name', 'Plant name is required.').notEmpty(), auth],
	async (req: Request, res: Response) => {
		const plantId = req.params.plantId
		let { name } = req.body

		try {
			let user: IUser | null = await User.findById(req.body.user.id)
			const plant: IPlant | null = await Plant.findById(plantId)

			/* Check if plant exists */
			if (!plant) {
				return res.status(401).json({ errors: [{ msg: 'Invalid plant ID.' }] })
			}

			/* Check if plant is associated with user */
			if (!user?.plants.some((plant: any) => plant.plant.toString() === plantId)) {
				return res
					.status(401)
					.json({ errors: [{ msg: 'Plant is not associated with this account.' }] })
			}

			/* If repeating a name, add incrementing digit to end */
			while (user.plants.some((plant: any) => plant.name === name)) {
				const lastChar = name.slice(-1)

				if (isNaN(parseInt(lastChar))) {
					name = name.concat('2')
				} else {
					name = name.substring(0, name.length - 1) + (parseInt(lastChar) + 1)
				}
			}

			/* Rename the indicated plant */
			const plantList = user?.plants.map((plant: any) => {
				if (plant.plant.toString() === plantId) {
					plant.name = name
				}
				return plant
			})

			await user.save()

			res.json({ plants: plantList })
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
router.put('/plant/:plantId?', auth, async (req: Request, res: Response) => {
	const plantId = req.params.plantId

	try {
		/* Verify that plant exists */
		if (!(await Plant.exists({ id: plantId })) || !plantId) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Plant not found. Please check the ID is entered correctly.' }] })
		}

		let plant: IPlant | null = await Plant.findById(plantId)

		if (!plant) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Plant not found. Please check the ID is entered correctly.' }] })
		}

		/* Get user */
		const user: IUser | null = await User.findById(req.body.user.id)
		const plants: Array<{ name?: string; plant: string }> | undefined = user?.plants

		/* Verify that the user exists */
		if (!user) {
			return res.status(401).json({ errors: [{ msg: 'User account not found.' }] })
		}

		/* Check that user has not exceeded max of 10 plants on account */
		if (plants && plants.length > 10) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'You already have 10 plants on your account!' }] })
		}

		/* Check if user already has this plant added */
		if (user.plants.some((element: any) => element.plant.toString() === plantId.toString())) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'This plant is already associated with your account!' }] })
		}

		/* Verify that plant not associated to another user's account */
		if (plant.isAssociated) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Plant is associated with another user's account." }] })
		}

		/* Add new plant to user's plant list */
		user.plants.unshift({ plant: plantId })

		/* Associate plant with user's profile */
		plant.isAssociated = true

		await user.save()
		await plant?.save()

		res.json({ plants: user.plants })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

/*******************************************************
 ******************* DELETE Requests *******************
 ******************************************************/

/*
 *	Brief: Remove plant from user's profile
 *	Path: /api/user/plant/:id
 */
router.delete('/plant/:plantId', auth, async (req: Request, res: Response) => {
	const plantId = req.params.plantId

	try {
		/* Verify that plant exists */
		let plant: IPlant | null = await Plant.findById(plantId)

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

		/* Make plant unoassociated */
		plant.isAssociated = false

		await user?.save()
		await plant.save()

		res.json({ plants: user?.plants })
	} catch (error) {
		res.status(500).json({ errors: [{ msg: 'Server error.' }] })
	}
})

export = router
