/*
 *   Routes for the following user functionalities:
 *
 *   1. Creating a user account
 *   2. Deleting a user account
 *   3. Adding plant to user account
 *
 */

const express = require('express')
const router = express.Router()

/* Import models */
const User = require('../../models/User')
const Plant

router.get('/', (req, res) => {
	res.send('User route hit!')
})

module.exports = router
