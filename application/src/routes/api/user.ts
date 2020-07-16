import express, { Request, Response } from 'express'

import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'

import User, { IUser } from '../../models/User'

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

		/* Registering user ... */
		const { username, email, password } = req.body

		try {
			/* Check if user is already registered */
			let user: IUser | null = await User.findOne({ email })

			if (user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists.' }] })
			}

			user = new User({ email, username })

			let hashPassword = bcrypt.hashSync(password, 10)
			user.password = hashPassword

			/* Save new user in the databse */
			await user.save()

			/* Return the user's id if successful */
			res.json({ user: user.id })
		} catch (error) {
			res.status(500).json({ errors: [{ msg: 'Server error' }] })
		}
	}
)

export = router
