import mongoose, { Schema, Document } from 'mongoose'

export interface IPlant extends Document {
	control: {
		soilMoisture: { setpoint?: number; tolerance?: number }
	}
	data: {
		soilMoisture: [{ measurement: number; date?: Date }]
		lightLevel: [{ measurement: number; date?: Date }]
	}
	isAssociated: boolean
	date?: Date
}

const plantSchema: Schema = new Schema({
	control: {
		soilMoisture: {
			setpoint: {
				type: Number,
				default: 400,
			},
			tolerance: {
				type: Number,
				default: 150,
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
