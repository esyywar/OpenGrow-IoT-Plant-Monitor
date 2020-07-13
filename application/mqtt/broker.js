const connectDB = require('../config/db')

const PlantData = require('../models/PlantData')
const config = require('config')

/* Setup MQTT broker */
const aedesOptions = { concurrency: 200, connectTimeout: 5000 }
const aedes = require('aedes')(aedesOptions)

/*******************************************************
 ****************** Initialize Broker ******************
 ******************************************************/

/* Connect to mongoDB */
connectDB()

/* Check for server port or run on local port 1883 */
const PORT = process.env.PORT || 3000

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
aedes.on('publish', async (publish, client) => {
	/* If not from an authenticated and connected client */
	if (!client) {
		return
	}

	/* If topic does not exist in database, create entry in database */
	try {
		const isPlantReg = await PlantData.findOne({ topic: publish.topic })

		if (!isPlantReg) {
			console.log('New plant! Registering him now...')
			newPlant = new PlantData({ topic: publish.topic })

			await newPlant.save()
		}
	} catch (error) {
		console.log(error.message)
	}

	console.log(`Published message ${publish.messageId} of topic ${publish.topic} to ${client.id}`)
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
	if (connack.returnCode == 4) {
		return console.log('Auth error.')
	}
	console.log(`Ack sent to ${client.id} with return code ${connack.returnCode}`)
})

/* For QOS 1 or 2  - Packet successfully delivered to client */
aedes.on('ack', async (packet, client) => {
	console.log(`Message ack\'d from ${client.id}`)
})
