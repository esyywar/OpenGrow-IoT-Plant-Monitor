/* MQTT subscriber */
import mqtt, { QoS } from 'mqtt'
import config from 'config'
import Plant, { IPlant } from '../models/Plant'
import {
	espPlantDataType,
	plantMetricEnum,
	getPlantIdFromTopic,
	getMetricFromTopic,
	intFromBytes,
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

/* Create mqtt client */
const client = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Record soil moisture value in database */
const soilDataReceived = async (plantId: string, soilMoisture: number) => {
	console.log('Publishing to soil: ' + soilMoisture)
	try {
		/* Get plant in database */
		let plant: IPlant | null = await Plant.findById(plantId)

		/* Verify plant is found in db */
		if (!plant) {
			return
		}

		plant.data.soilMoisture.push({ measurement: soilMoisture, date: new Date() })
		await plant.save()
	} catch (error) {
		console.log(error)
	}
}

/* Record light level value in database */
const lightDataReceived = async (plantId: string, lightLevel: number) => {
	console.log('Publishing to light: ' + lightLevel)
	try {
		/* Get plant in database */
		let plant: IPlant | null = await Plant.findById(plantId)

		/* Verify plant is found in db */
		if (!plant) {
			return
		}

		plant.data.lightLevel.push({ measurement: lightLevel, date: new Date() })
		await plant.save()
	} catch (error) {
		console.group(error)
	}
}

/* Subscribe to topic */
client.on('connect', async () => {
	console.log('Subscriber connected!')

	try {
		/* Get all plants that are associated with users - must subscribe to these messages */
		const activePlants = await Plant.find({ isAssociated: true })

		/* For each plant associated with a user, subscribe to topics */
		const soilMoisTopics = activePlants.map((plant: IPlant) => `${plant.id}/soilMoisture`)
		const lightLevelTopics = activePlants.map((plant: IPlant) => `${plant.id}/lightLevel`)
		const subTopics = soilMoisTopics.concat(lightLevelTopics)

		/* Broker subscribes to messages from ESP8266 connected plants */
		client.subscribe(subTopics, { qos: mqttQoS }, (error) => {
			if (error) {
				client.end()
			}
		})

		/*
		 *  Client action on topic
		 *	Brief: topic is of the form: ${plantId}/:plantMetric
		 */
		client.on('message', async (topic, msgBuffer: any) => {
			/* Get data value from bytes sent by esp */
			const buf: string = msgBuffer.toString()
			const payload: espPlantDataType = JSON.parse(buf)
			const data = intFromBytes(payload.highByte, payload.lowByte)

			/* Get the plant's id in database from topic root */
			const plantId: string = getPlantIdFromTopic(topic)

			/* Check the topic to see what data has been sent */
			const plantMetric: string = getMetricFromTopic(topic)

			switch (plantMetric) {
				case plantMetricEnum.soilMoisture:
					soilDataReceived(plantId, data)
					break
				case plantMetricEnum.lightLevel:
					lightDataReceived(plantId, data)
					break
			}
		})
	} catch (error) {
		console.log(error)
	}
})
