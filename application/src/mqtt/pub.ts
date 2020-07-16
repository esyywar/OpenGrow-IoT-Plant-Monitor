/* MQTT publisher */
import mqtt from 'mqtt'

/* Connecting to broker */
import config from 'config'

const mqttQoS = config.get('mqttQoS')

const connectOptions: object = {
	username: config.get('mqttBrokerUsername'),
	password: config.get('mqttBrokerPassword'),
	reconnectPeriod: 5000,
}

const client: any = mqtt.connect('mqtt://localhost:1885', connectOptions)

/* Plant moisture level topic */
const topic: string = 'plant_1234'

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
