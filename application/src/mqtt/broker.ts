import config from 'config'

/* Setup MQTT broker */
const aedesOptions = { concurrency: 200, connectTimeout: 5000 }
const aedes = require('aedes')(aedesOptions)

/*******************************************************
 ****************** Initialize Broker ******************
 ******************************************************/

/* Check for server port or run on local port 1883 */
const PORT = process.env.PORT || 1883

/* Create MQTT client */
const server = require('net').createServer(aedes.handle)

/* Connect broker to port */
server.listen(PORT, '0.0.0.0', () => {
	console.log('Broker is listening on port ' + PORT)
})

/*******************************************************
 *************** Broker Authentication *****************
 ******************************************************/

aedes.authenticate = (client: any, username: string, password: string, callback: any) => {
	try {
		if (
			username.toString() === config.get('mqtt.brokerUsername') &&
			password.toString() === config.get('mqtt.brokerPassword')
		) {
			callback(null, true)
		} else {
			/* Incorrect username + password */
			var error: any = new Error('Auth error')
			error.returnCode = 4
			callback(error, null)
		}
	} catch (error) {
		/* Username and/or password not provided */
		var error: any = new Error('Auth error')
		error.returnCode = 3
		callback(error, null)
	}
}

/*******************************************************
 ****************** Broker Events **********************
 ******************************************************/

/* Fire when broker connected */
aedes.on('clientReady', (client: any) => {
	console.log(`Client ${client.id} has connected!`)
})

/* Publish message reaches to the broker */
aedes.on('publish', async (publish: any, client: any) => {
	/* If not from an authenticated and connected client */
	if (!client) {
		return
	}

	console.log(`Published message ${publish.messageId} of topic ${publish.topic} from ${client.id}`)
})

/* Client subscribes to a topic */
aedes.on('subscribe', (subscriptions: any, client: any) => {
	subscriptions.forEach((topic: any) => {
		console.log(`Client ${client.id} has subscribed to ${topic.topic} with QoS ${topic.qos}`)
	})
})

/* Client unsubscribes to a topic */
aedes.on('unsubscribe', (unsubscriptions: any, client: any) => {
	console.log(`Client ${client.id} has unsubscribed from ${unsubscriptions}`)
})

/* Connection acknowledgement sent from  server to client */
aedes.on('connackSent', (connack: any, client: any) => {
	if (connack.returnCode == 4) {
		return console.log('Auth error.')
	}
	console.log(`Ack sent to ${client.id} with return code ${connack.returnCode}`)
})

/* For QOS 1 or 2  - Packet successfully delivered to client */
aedes.on('ack', async (packet: any, client: any) => {
	console.log(`Message ack\'d from ${client.id}`)
})

/* On client disconnect */
aedes.on('clientDisconnect', (client: any) => {
	console.log(`Client ${client.id} has disconnected`)
})
