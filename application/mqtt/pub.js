/* MQTT publisher */
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
const topic = 'soilMoisture'

const message = 'Plant moisture level is ____'

client.on('connect', () => {
	console.log('Publisher connected!')

	setInterval(() => {
		client.publish(topic, message, { qos: mqttQoS })
	}, 7000)

	client.on('error', (error) => {
		console.log(error)
	})
})
