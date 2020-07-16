import mongoose, { Schema, Document } from 'mongoose'

export interface IAdmin extends Document {
	email: string
	password: string
	date: Date
}

const adminSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
})

export default mongoose.model<IAdmin>('Admin', adminSchema)
