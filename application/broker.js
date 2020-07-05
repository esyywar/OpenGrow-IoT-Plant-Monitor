const aedes = require("aedes")()

/* Check for server port or run on local port 1883 */
const PORT = process.env.PORT || 1883

/* Create MQTT client */
const server = require("net").createServer(aedes.handle)

server.listen(PORT, () => {
  console.log("Server is listening on port " + PORT)
})
