import mongoose, { Schema, Document } from 'mongoose'

export interface IPlant extends Document {
	setpoints: {
		soilMoisture: { lowerLimit: number; upperLimit: number }
	}
	data: {
		soilMoisture: [{ measurement: number; date?: Date }]
		lightLevel: [{ measurement: number; date?: Date }]
	}
	isAssociated: boolean
	date?: Date
}

const plantSchema: Schema = new Schema({
	setpoints: {
		soilMoisture: {
			lowerLimit: {
				type: Number,
			},
			upperLimit: {
				type: Number,
			},
		},
	},
	data: {
		soilMoisture: [
			{
				measurement: {
					type: Number,
					required: true,
				},
				date: {
					type: Date,
					required: true,
					default: Date.now(),
				},
			},
		],
		lightLevel: [
			{
				measurement: {
					type: Number,
					required: true,
				},
				date: {
					type: Date,
					required: true,
					default: Date.now(),
				},
			},
		],
	},
	isAssociated: {
		type: Boolean,
		required: true,
		default: false,
	},
	date: {
		type: Date,
		required: true,
		default: Date.now(),
	},
})

export default mongoose.model<IPlant>('Plant', plantSchema)
