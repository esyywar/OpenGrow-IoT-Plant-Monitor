const connectDB = require('../config/db')

const PlantMetrics = require('../models/PlantMetrics')
const config = require('config')

/* Setup MQTT broker */
const aedesOptions = { concurrency: 200, connectTimeout: 5000 }
const aedes = require('aedes')(aedesOptions)

/*******************************************************
 ****************** Initialize Broker ******************
 ******************************************************/

/* Check for server port or run on local port 1883 */
const PORT = process.env.PORT || 1883

/* Connect to mongoDB */
connectDB()

/* Create MQTT client */
const server = require('net').createServer(aedes.handle)

/* Connect broker to port */
server.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT)
})

/*******************************************************
 *************** Broker Authentication *****************
 ******************************************************/

aedes.authenticate = (client, username, password, callback) => {
	if (
		username.toString() === config.get('mqttBrokerUsername') &&
		password.toString() === config.get('mqttBrokerPassword')
	) {
		console.log(`Client ${client.id} has been authenticated!`)
		callback(null, true)
	} else {
		var error = new Error('Auth error')
		error.returnCode = 4
		callback(error, null)
	}
}

/*******************************************************
 ****************** Broker Events **********************
 ******************************************************/

/* Fire when broker connected */
aedes.on('clientReady', (client) => {
	console.log(`Client ${client.id} has connected!`)
})

/* Publish message reaches to the broker */
aedes.on('publish', (publish, client) => {
	if (client) {
		console.log(`Published message ${publish.messageId} of topic ${publish.topic} to ${client.id}`)
	}
})

/* Client subscribes to a topic */
aedes.on('subscribe', (subscriptions, client) => {
	subscriptions.forEach((topic) => {
		console.log(`Client ${client.id} has subscribed to ${topic.topic} with QoS ${topic.qos}`)
	})
})

/* Client unsubscribes to a topic */
aedes.on('unsubscribe', (unsubscriptions, client) => {
	console.log(`Client ${client.id} has unsubscribed from ${unsubscriptions}`)
})

/* Connection acknowledgement sent from  server to client */
aedes.on('connackSent', (connack, client) => {
	console.log(`Ack sent to ${client.id} with return code ${connack.returnCode}`)
})

/* For QOS 1 or 2  - Packet successfully delivered to client */
aedes.on('ack', async (message, client) => {
	console.log(`Message ack\'d from ${client.id}`)

	/* Make dummy entry in database */
	const dummyMetrics = {
		topic: 'dfnjwkqg212',
		soilMoisture: 400,
		lightLevel: 42,
	}

	metrics = new PlantMetrics(dummyMetrics)

	try {
		await metrics.save()
	} catch (error) {
		console.log(error.message)
	}
})
