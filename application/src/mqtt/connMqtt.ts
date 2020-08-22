import config from 'config'
import mqtt from 'mqtt'

const connectOptions: object = {
	clientId: 'webApplicationServer',
	username: config.get('mqtt.brokerUsername'),
	password: config.get('mqtt.brokerPassword'),
	keepalive: 120,
	reconnectPeriod: 5000,
}

const connectBroker = () => {
	/* Create mqtt client */
	const client = mqtt.connect(config.get('mqtt.brokerUrl'), connectOptions)

	client.on('connect', async () => {
		console.log('Application backend connected!')
	})
}

export default connectBroker
