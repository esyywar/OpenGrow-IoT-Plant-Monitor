/* MQTT subscriber */
const mqtt = require("mqtt")

const client = mqtt.connect("mqtt://localhost:1883")

/* Plant moisture level topic */
const topic = "soilMoisture"

/* Subscribe to topic */
client.on("connect", () => {
  console.log("Subscriber connected!")

  client.subscribe(topic, { qos: 1 }, (error) => {
    if (!error) {
      client.end()
    }
  })

  /* Client action on topic */
  client.on("message", (topic, payload) => {
    payload = payload.toString()

    /* TODO action on receving data */
  })
})
