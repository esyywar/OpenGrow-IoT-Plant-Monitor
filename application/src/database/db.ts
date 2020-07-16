import mongoose from 'mongoose'
import config from 'config'

const db: string = config.get('mongoUri')

/* Connecting to MongoDB */
async function connectDB() {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		})
		console.log('MongoDB connected')
	} catch (err) {
		console.log(err.message)
		process.exit(1)
	}
}

export default connectDB
