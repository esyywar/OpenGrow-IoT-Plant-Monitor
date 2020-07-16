import express, { Request, Response } from 'express'

import config from 'config'

import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'

import User, { IUser } from '../../models/User'

import jwt from 'jsonwebtoken'
import { userInfo } from 'os'

const router = express.Router()

/*******************************************************
 ******************** GET Requests *********************
 ******************************************************/

/*******************************************************
 ******************** POST Requests *********************
 ******************************************************/

/* Registering a new user */
router.post(
	'/',
	[
		check('username', 'Username is required').notEmpty(),
		check('email', 'Please include a valid email.').isEmail(),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters long')
			.matches(/\d/)
			.withMessage('Password must contain a number'),
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
			res.status(500).json({ errors: [{ msg: 'Server error' }] })
		}
	}
)

/* User log in */
router.post(
	'/login',
	[
		check('email', 'Email is required').notEmpty(),
		check('password', 'Password is required').notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		/* If errors in validation, throw response */
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body

		const user: IUser | null = await User.findOne({ email })

		/* Checking if user exists */
		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'Invalid login credentials' }] })
		}

		let isValid = bcrypt.compare(password, user.password)

		if (!isValid) {
			return res.status(400).json({ errors: [{ msg: 'Invalid login credentials' }] })
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
	}
)

export = router
