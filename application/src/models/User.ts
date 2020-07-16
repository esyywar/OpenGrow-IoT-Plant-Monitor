import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
	email: string
	username: string
	password: string
	date: Date
	plants: [{ name?: string; plant: string }]
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
			name: {
				type: String,
				required: true,
				default: 'My_Plant',
			},
			plant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Plant',
			},
		},
	],
})

export default mongoose.model<IUser>('User', userSchema)
