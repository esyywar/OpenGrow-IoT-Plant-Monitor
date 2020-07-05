/* Schema for measured plant metrics (soil moisture and light) */

const mongoose = require("mongoose")

const plantMetricSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  soilMoisture: {
    type: Number,
  },
  lightLevel: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
})

PlantMetrics = mongoose.model("plantMetrics", plantMetricSchema)

module.exports = PlantMetrics
