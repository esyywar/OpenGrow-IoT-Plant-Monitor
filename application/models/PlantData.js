/* Schema for measured plant metrics (soil moisture and light) */

const mongoose = require('mongoose')

const plantDataSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true,
	},
	soilMoisture: [
		{
			measurement: {
				type: Number,
			},
			date: {
				type: Date,
				default: Date.now(),
			},
		},
	],
	lightLevel: [
		{
			measurement: {
				type: Number,
			},
			date: {
				type: Date,
				default: Date.now(),
			},
		},
	],
	date: {
		type: Date,
		default: Date.now(),
	},
})

PlantData = mongoose.model('plantData', plantDataSchema)

module.exports = PlantData
