/* Setup MQTT broker */
const aedesOptions = { concurrency: 200, connectTimeout: 5000 }
const aedes = require("aedes")(aedesOptions)

/**************************************
 ********* Initialize Broker **********
 *************************************/

/* Check for server port or run on local port 1883 */
const PORT = process.env.PORT || 1883

/* Create MQTT client */
const server = require("net").createServer(aedes.handle)

/* Connect broker to port */
server.listen(PORT, () => {
  console.log("Server is listening on port " + PORT)
})

/**************************************
 *********** Broker Events ************
 *************************************/

/* Fire when broker connected */
aedes.on("clientReady", (client) => {
  console.log(`Client ${client.id} has connected!`)
})

/* Fire when message has been published to the broker */
aedes.on("publish", (publish, client) => {
  console.log(`Published message ${publish.messageId} to ${publish.topic} with QoS ${publish.qos}`)
  client && console.log(`Published to ${client.id}`)
})

/* On acknowledge from QOS 1 or 2 */
aedes.on("ack", (message, client) => {
  console.log(`${message} ack\'d from ${client.id}`)
})
