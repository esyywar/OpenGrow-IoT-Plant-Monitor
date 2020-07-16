import mongoose, { Schema, Document } from 'mongoose'

import { IPlant } from './Plant'

export interface IUser extends Document {
	email: string
	username: string
	password: string
	date: Date
	plants: IPlant['_id']
}

const userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	plants: [
		{
			plant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Plant',
			},
		},
	],
})

export default mongoose.model<IUser>('User', userSchema)
