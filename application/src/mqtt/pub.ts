/* MQTT publisher */
import mqtt from 'mqtt'

/* Connecting to broker */
import config from 'config'

const mqttQoS = config.get('mqtt.qos')

const connectOptions: object = {
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	reconnectPeriod: 5000,
}

const client: any = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

/* Plant moisture level topic */
const topic: string = '5f14fc26066e941a68d81828/data'

const message = {
	soilMoisture: 400,
	lightLevel: 42,
}

client.on('connect', () => {
	console.log('Publisher connected!')

	setInterval(() => {
		client.publish(topic, JSON.stringify(message), { qos: mqttQoS })
	}, 15000)

	client.on('error', (error: object) => {
		console.log(error)
	})
})
