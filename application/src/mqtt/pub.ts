/* MQTT publisher */
import mqtt from 'mqtt'

/* Connecting to broker */
import config from 'config'

import { espPlantDataType } from './util'

const mqttQoS = config.get('mqtt.qos')

const connectOptions: object = {
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	reconnectPeriod: 5000,
}

const client: any = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Plant moisture level topic (3rd in database) */
const soilTopic: string = '5f2db60230c9640b04ef156f/soilMoisture'
const lightTopic: string = '5f2db60230c9640b04ef156f/lightLevel'

const soilData: espPlantDataType = {
	highByte: 6,
	lowByte: 42,
}

const lightData: espPlantDataType = {
	highByte: 4,
	lowByte: 160,
}

client.on('connect', () => {
	console.log('Publisher connected!')

	setInterval(() => {
		client.publish(soilTopic, JSON.stringify(soilData), { qos: mqttQoS })
		//client.publish(lightTopic, JSON.stringify(lightData), { qos: mqttQoS })
	}, 300000)

	client.on('error', (error: object) => {
		console.log(error)
	})
})
