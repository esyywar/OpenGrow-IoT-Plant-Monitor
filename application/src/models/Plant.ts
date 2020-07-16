import mongoose, { Schema, Document } from 'mongoose'

export interface IPlant extends Document {
	name: string
	pubTopic: string
	soilMoisture: [{ measurement: number; date: Date }]
	lightLevel: [{ measurement: number; date: Date }]
	date: Date
}

const plantSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		default: 'My Plant',
	},
	pubTopic: {
		type: String,
		required: true,
		unique: true,
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

export default mongoose.model<IPlant>('Plant', plantSchema)
