/* MQTT subscriber */
const mqtt = require("mqtt")

const client = mqtt.connect("mqtt://localhost:1883")

/* Plant moisture level topic */
const topic = "soilMoisture"

/* Subscribe to topic */
client.on("connect", () => {
  console.log("Subscriber connected!")

  client.subscribe(topic, (error) => {
    if (!error) {
      console.log("Sub -> Subscribed to topic!")
    }
  })

  /* Client action on topic */
  client.on("message", (topic, payload) => {
    payload = payload.toString()
    console.log(`MQTT Subscriber Message.  Topic: ${topic}.  Message: ${payload.toString()}`)
  })
})
