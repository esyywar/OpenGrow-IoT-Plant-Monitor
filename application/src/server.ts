import express, { Application, Request, Response, NextFunction } from 'express'

import bodyParser from 'body-parser'

import connectDB from './database/db'

import connectBroker from './server-mqtt/connMqtt'

import { QoS } from 'mqtt'

import config from 'config'

import Plant, { IPlant } from './models/Plant'

import {
	espPlantDataType,
	plantMetricEnum,
	getPlantIdFromTopic,
	getMetricFromTopic,
	intFromBytes,
} from './server-mqtt/util'

import { soilDataReceived, lightDataReceived } from './server-mqtt/msgHandle'

/********************** INITIAL BACKEND APPLICATION SET-UP *******************/

const server: Application = express()

/* Middleware for parsing */
server.use(bodyParser.urlencoded({ extended: false }))
server.use(express.json())

/* Get port */
const PORT = process.env.PORT || 5000

/* Listen on port */
server.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT)
})

server.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('Ottogrow plant monitor server running!')
})

/************************ CONNECTION TO MONGO DATABASE **********************/

/* Connecting to database */
connectDB()

/************************** BACK END API ROUTES ************************/

/* Routes to api */
server.use('/api/plant', require('./routes/api/plant'))
server.use('/api/user', require('./routes/api/user'))

/************************ CONNECTION TO MQTT BROKER AND MESSAGE HANDLING *******************/

/* Connecting to mqtt broker */
export const mqttClient = connectBroker()

/* QoS for messages */
const mqttQoS: QoS = config.get('mqtt.qos')

/* Subscribe to topics and handle messages */
mqttClient.on('connect', async () => {
	console.log('Subscriber connected!')

	try {
		/* Get all plants that are associated with users - must subscribe to these messages */
		const activePlants = await Plant.find({ isAssociated: true })

		/* For each plant associated with a user, subscribe to topics */
		const soilMoisTopics = activePlants.map((plant: IPlant) => `${plant.id}/soilMoisture`)
		const lightLevelTopics = activePlants.map((plant: IPlant) => `${plant.id}/lightLevel`)
		const subTopics = soilMoisTopics.concat(lightLevelTopics)

		/* Broker subscribes to messages from ESP8266 connected plants */
		mqttClient.subscribe(subTopics, { qos: mqttQoS }, (error) => {
			if (error) {
				mqttClient.end()
			}
		})

		/*
		 *  Client action on topic
		 *	Brief: topic is of the form: ${plantId}/:plantMetric
		 */
		mqttClient.on('message', async (topic, msgBuffer: any) => {
			/* Get data value from bytes sent by esp */
			const buf: string = msgBuffer.toString()
			const payload: espPlantDataType = JSON.parse(buf)
			const data = intFromBytes(payload.highByte, payload.lowByte)

			/* Get the plant's id in database from topic root */
			const plantId: string = getPlantIdFromTopic(topic)

			/* Check the topic to see what data has been sent */
			const plantMetric: string = getMetricFromTopic(topic)

			try {
				/* Get plant in database */
				let plant: IPlant | null = await Plant.findById(plantId)

				/* Verify plant is found in db */
				if (!plant) {
					return
				}

				switch (plantMetric) {
					case plantMetricEnum.soilMoisture:
						soilDataReceived(plant, data)
						break
					case plantMetricEnum.lightLevel:
						lightDataReceived(plant, data)
						break
				}
			} catch (error) {
				console.log(error)
			}
		})
	} catch (error) {
		console.log(error)
	}
})
