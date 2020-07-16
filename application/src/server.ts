import express, { Application, Request, Response, NextFunction } from 'express'

import connectDB from './database/db'

const server: Application = express()

/* Middleware for parsing */
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

/* Routes to api */
server.use('/api/plant', require('./routes/api/plant'))
server.use('/api/user', require('./routes/api/user'))
