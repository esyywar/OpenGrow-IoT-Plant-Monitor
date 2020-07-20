/* MQTT subscriber */
import mqtt, { QoS } from 'mqtt'
import config from 'config'
import Plant, { IPlant } from '../models/Plant'
import {
	plantVarEnum,
	getPlantIdFromTopic,
	getMsgTypeFromTopic,
	getPlantVarFromTopic,
} from './util'

/* Subscriber must be connected to db for updating plant documents */
import connectDB from '../database/db'

connectDB()

const mqttQoS: QoS = config.get('mqtt.qos')

const connectOptions: object = {
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	keepalive: 120,
	reconnectPeriod: 5000,
}

const client = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Plant moisture level topic */
const topic = 'testId/plant_1234'

/* Subscribe to topic */
client.on('connect', async () => {
	console.log('Subscriber connected!')

	try {
		/* Get all plants that are associated with users - must subscribe to these messages */
		const activePlants = await Plant.find({ isAssociated: true })

		/* For each plant associated with a user, subscribe to topics */
		let subTopics = activePlants
			.map((plant: IPlant) => `${plant.id}/data/soilmoisture`)
			.concat(activePlants.map((plant: IPlant) => `${plant.id}/data/light`))

		/* Broker subscribes to messages from ESP8266 connected plants */
		client.subscribe(subTopics, { qos: mqttQoS }, (error) => {
			if (error) {
				client.end()
			}
		})

		/*	Client action on topic
		 *	Brief: topic is of the form: ${plantId}/data/${plantMetric}
		 */
		client.on('message', async (topic, payload: any) => {
			payload = JSON.parse(payload)

			console.log(
				`Received soilMoisture: ${payload.soilMoisture}, light level: ${payload.lightLevel}`
			)

			/* Get the plant's id in database from topic root */
			const plantId: string = getPlantIdFromTopic(topic)

			let plant: IPlant | null = await Plant.findById(plantId)

			/* Verify plant is found in db and topic is giving data */
			if (!plant || getMsgTypeFromTopic(topic) !== 'data') {
				return
			}

			/* Publish data in db */
			const plantVar = getPlantVarFromTopic(topic)

			switch (plantVar) {
				case plantVarEnum.soilMoisture:
					plant.data.soilMoisture.push({ measurement: payload.soilMoisture })
					await plant.save()
					break
				case plantVarEnum.lightLevel:
					plant.data.soilMoisture.push({ measurement: payload.lightLevel })
					await plant.save()
					break
				default:
					console.log(plantVar)
			}
		})
	} catch (error) {
		console.log(error)
	}
})
