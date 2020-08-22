import config from 'config'

import asyncMQTT from 'async-mqtt'
import mqtt from 'mqtt'

const connectOptions: object = {
	clientId: 'webApplicationServer',
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	keepalive: 120,
	reconnectPeriod: 5000,
}

/* Connect to broker and return client */
const connectBroker = () => {
	const client: mqtt.MqttClient = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

	return client.on('connect', () => {
		return client
	})
}

export default connectBroker
