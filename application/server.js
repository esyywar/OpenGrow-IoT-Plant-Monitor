const express = require('express')
const app = express()

/* Connect to mongoDB */
const connectDB = require('./config/db')
connectDB()

/* Middleware for parsing PUT and POST requests */
app.use(express.json())

/* Set port as production server or 5000 for development */
const PORT = process.env.PORT || 5000

/* Get at root index */
app.get('/', (req, res) => res.send('API running'))

/* API routes */
app.use('/api/users', require('./routes/api/users'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
