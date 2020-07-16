import express, { Application, Request, Response, NextFunction } from 'express'

import connectDB from './config/db'

const server: Application = express()

/* Middleware for parsing PUT and POST requests */
server.use(express.json())

/* Get port */
const PORT = process.env.PORT || 3000

/* Listen on port */
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT} ...`)
})

server.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('ts activee')
})

connectDB()
