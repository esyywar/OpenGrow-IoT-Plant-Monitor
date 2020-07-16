/* MQTT subscriber */
import mqtt, { QoS } from 'mqtt'

/* Connecting to broker */
import config from 'config'

const mqttQoS: QoS = config.get('mqttQoS')

const connectOptions: object = {
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

	/* To receive messages from publisher on desktop */
	client.subscribe(topic, { qos: mqttQoS }, (error) => {
		if (error) {
			client.end()
		}
	})

	/* To receive messages from ESP8266 */
	client.subscribe('esp8266_plant', { qos: mqttQoS }, (error) => {
		if (error) {
			client.end()
		}
	})

	/* Client action on topic */
	client.on('message', (topic, payload: any) => {
		payload = JSON.parse(payload)
		console.log(
			`Received soilMoisture: ${payload.soilMoisture}, light level: ${payload.lightLevel}`
		)

		/* TODO action on receving data */
	})
})