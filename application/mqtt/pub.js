/* MQTT publisher */
const mqtt = require("mqtt")

const client = mqtt.connect("mqtt://localhost:1883")

/* Plant moisture level topic */
const topic = "soilMoisture"

const message = "Plant moisture level is ____"

client.on("connect", () => {
  console.log("Publisher connected!")

  setInterval(() => {
    client.publish(topic, message, { qos: 2 })
  }, 7000)

  client.on("error", (error) => {
    console.log(error)
  })
})
