import express, { Application, Request, Response, NextFunction } from 'express'
const bodyParser = require('body-parser')
const path = require('path')

import connectDB from './database/db'

const server: Application = express()

/* Middleware for parsing */
server.use(bodyParser.urlencoded({ extended: false }))
server.use(express.json())

/* Get port */
const PORT = process.env.PORT || 5000

/* Listen on port */
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT} ...`)
})

server.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('Ottogrow plant monitor server running!')
})

connectDB()

/* Routes to api */
server.use('/api/plant', require('./routes/api/plant'))
server.use('/api/user', require('./routes/api/user'))
