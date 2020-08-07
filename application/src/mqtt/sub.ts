/* MQTT subscriber */
import mqtt, { QoS } from 'mqtt'
import config from 'config'
import Plant, { IPlant } from '../models/Plant'
import { plantVarEnum, getPlantIdFromTopic } from './util'

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

/* Payload type from plant monitor */
type plantData = {
	soilMoisture?: number
	lightLevel?: number
}

const client = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Subscribe to topic */
client.on('connect', async () => {
	console.log('Subscriber connected!')

	try {
		/* Get all plants that are associated with users - must subscribe to these messages */
		const activePlants = await Plant.find({ isAssociated: true })

		/* For each plant associated with a user, subscribe to topics */
		let subTopics = activePlants.map((plant: IPlant) => `${plant.id}/data`)

		/* Broker subscribes to messages from ESP8266 connected plants */
		client.subscribe(subTopics, { qos: mqttQoS }, (error) => {
			if (error) {
				client.end()
			}
		})

		/*	Client action on topic
		 *	Brief: topic is of the form: ${plantId}/data
		 */
		client.on('message', async (topic, msgBuffer: any) => {
			const buf: string = msgBuffer.toString()

			console.log(buf)

			const payload: plantData = JSON.parse(buf)

			/* Get the plant's id in database from topic root */
			const plantId: string = getPlantIdFromTopic(topic)

			let plant: IPlant | null = await Plant.findById(plantId)

			/* Verify plant is found in db */
			if (!plant) {
				return
			}

			if (payload.soilMoisture) {
				plant.data.soilMoisture.push({ measurement: payload.soilMoisture })
				await plant.save()
			}
			if (payload.lightLevel) {
				plant.data.lightLevel.push({ measurement: payload.lightLevel })
				await plant.save()
			}
		})
	} catch (error) {
		console.log(error)
	}
})
