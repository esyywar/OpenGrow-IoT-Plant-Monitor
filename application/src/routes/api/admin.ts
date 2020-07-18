import express, { Request, Response } from 'express'

import config from 'config'

import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'

import jwt from 'jsonwebtoken'

import Admin, { IAdmin } from '../../models/Admin'

import auth from '../../middleware/auth'

const router = express.Router()

export = router

/*******************************************************
 ******************** POST Requests ********************
 ******************************************************/

router.post(
	'/login',
	[
		check('email', 'Email is required.').notEmpty(),
		check('password', 'Password is required.').notEmpty(),
	],
	async (req: Request, res: Response) => {}
)
