/* Model for users */

const mongoose = reqiure('mongoose')

userSchema = new mongoose.Schema({
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
	plants: [
		{
			plant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'PlantData',
			},
		},
	],
})

User = mongoose.model('User', userSchema)

module.exports = User
