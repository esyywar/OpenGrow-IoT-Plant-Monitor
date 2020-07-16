import express, { Request, Response, NextFunction } from 'express'

import config from 'config'

import jwt from 'jsonwebtoken'

/*******************************************************
 ************* Authentication Middleware ***************
 ******************************************************/

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('x-auth-token')

	if (!token) {
		return res.status(401).json({ msg: 'No token found, authorization denied.' })
	}

	try {
		/* Decode token to get user id */
		const decoded: object | string | null = jwt.verify(token, config.get('jwt.jwtSecret'))

		/* Unless error, will return an object */
		if (typeof decoded === 'object') {
			req.body.user = (decoded as any).user
			next()
		}
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid.' })
	}
}

export default auth
