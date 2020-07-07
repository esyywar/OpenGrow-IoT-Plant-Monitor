/* MQTT subscriber */
const mqtt = require('mqtt')

/* Connecting to broker */
const config = require('config')

const mqttQoS = config.get('mqttQoS')

const connectOptions = {
	username: config.get('mqttBrokerUsername'),
	password: config.get('mqttBrokerPassword'),
	reconnectPeriod: 5000,
}

const client = mqtt.connect('mqtt://localhost:1883', connectOptions)

/* Plant moisture level topic */
const topic = 'plant_1234'

/* Subscribe to topic */
client.on('connect', () => {
	console.log('Subscriber connected!')

	client.subscribe(topic, { qos: mqttQoS }, (error) => {
		if (error) {
			client.end()
		}
	})

	/* Client action on topic */
	client.on('message', (topic, payload) => {
		payload = JSON.parse(payload)
		console.log(
			`Received soilMoisture: ${payload.soilMoisture}, light level: ${payload.lightLevel}`
		)

		/* TODO action on receving data */
	})
})
