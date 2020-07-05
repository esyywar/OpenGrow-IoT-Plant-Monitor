const mongoose = require("mongoose")
const config = require("config")

const db = config.get("mongoUri")

/* Connecting to MongoDB */
async function connectDB() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log("MongoDB connected")
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
