/*
 *	Brief: This is a proxy publisher to test the MQTT broker (to be during development)
 *		   	Publishes to provided topics which gives messages which will be caught by the subscriber
 *
 *  To disable this proxy publisher:
 * 			1. Open package.json
 * 			2. Look under "scripts"
 * 			3. See the "mqtt" script
 * 			4. Delete "\"node dist/server-mqtt/pub\""
 *
 */

/* MQTT publisher */
import mqtt from 'mqtt'

/* Connecting to broker */
import config from 'config'

/* High and low bytes packet sent from ESP */
export type espPlantDataType = {
	highByte: number
	lowByte: number
}

const mqttQoS = config.get('mqtt.qos')

const connectOptions: object = {
	clientId: 'ProxyPublisher',
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	reconnectPeriod: 5000,
}

const client: any = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Plant moisture level topic (3rd plant in database) */
const soilTopic: string = '5f2db60030c9640b04ef156e/soilMoisture'
const lightTopic: string = '5f2db60030c9640b04ef156e/lightLevel'

const soilData: espPlantDataType = {
	highByte: 6,
	lowByte: 140,
}

const lightData: espPlantDataType = {
	highByte: 4,
	lowByte: 160,
}

client.on('connect', () => {
	console.log('Publisher connected!')

	setInterval(() => {
		client.publish(soilTopic, JSON.stringify(soilData), { qos: mqttQoS })
		client.publish(lightTopic, JSON.stringify(lightData), { qos: mqttQoS })
	}, 300000)

	client.on('error', (error: object) => {
		console.log(error)
	})
})
