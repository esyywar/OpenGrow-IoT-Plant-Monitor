const express = require("express")

const connectDB = require("./config/db")

const app = express()

/* Connect to mongoDB */
connectDB()

/* Middleware for parsing PUT and POST requests */
app.use(express.json())

/* Set port as production server or 5000 for development */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
