import { Request, Response, NextFunction } from 'express'

import Admin, { IAdmin } from '../models/Admin'

/*******************************************************
 *********** Admin Authentication Middleware ***********
 ******************************************************/

/* Admin auth -> middleware to be run following auth */
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const admin: IAdmin | null = await Admin.findById(req.body.user)

		if (!admin) {
			return res.status(401).json({ msg: 'This route requires administrator level access.' })
		}

		next()
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid.' })
	}
}

export default adminAuth
