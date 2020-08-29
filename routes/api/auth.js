const express = require('express'),
	router = express.Router(),
	auth = require('../../middleware/auth'),
	User = require('../../models/User'),
	jwt = require('jsonwebtoken'),
	config = require('config'),
	bcrypt = require('bcryptjs'),
	{ errored } = require('../../config/globalFunc'),
	{ check, validationResult } = require('express-validator')

// @route 	GET api/auth
// @desc 		Test route
// @ access	Protected
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
			.select('-password')

		res.json(user)

	} catch (e) {
		console.error(e.message)
		res.status(500)
			.send('Server Error')
	}
})

// @route 	POST api/login
// @desc 		Register User
router.post('/', [
	// @ access	Public
	check('email', 'Please include a valid email')
		.isEmail(),
	check('password', 'Please enter a password')
		.exists()
], async (req, res) => {

	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return errored(res, 400, errors.array())
	}
	console.log(req.body)

	// See if the user exists
	try {
		const { email, password } = req.body,
			user = await User.findOne({
				email
			})


		if (!user) {
			return errored(res, 400, [{ 'msg': 'Invalid Credentials' }])
		}

		const isMatch = bcrypt.compare(password, user.password)

		if (!isMatch) {
			return errored(res, 400, [{ 'msg': 'Invalid Credentials' }])
		}

		await user.save()

		const payload = {
			user: {
				_id: user._id
			}
		}

		jwt.sign(payload,
			config.get('jwtSecret'),
			{
				expiresIn: config.get('jwtExpiration')
			}, (e, token) => {
				if (e) throw e
				res.json({ token })
			}
		)

	} catch (e) {
		console.error(e.message)
		res.status(500)
			.send('Server Error')
	}

})

module.exports = router