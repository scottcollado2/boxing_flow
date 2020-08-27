const express = require('express'),
	router = express.Router(),
	gravatar = require('gravatar'),
	bcrypt = require('bcryptjs'),
	jwt = require('jsonwebtoken'),
	config = require('config'),
	{ errored } = require('../../config/globalFunc'),
	{ check, validationResult } = require('express-validator'),
	User = require('../../models/User'),
	auth = require('../../middleware/auth')

// @route 	GET api/users
// @desc 		Register User
// @ access	Public
router.post('/', [
	check('name', 'Name is required')
		.not()
		.isEmpty(),
	check('email', 'Please include a valid email')
		.isEmail(),
	check('password', 'Please enter a password with 6 or more characters')
		.isLength({
			min: 6
		})
], async (req, res) => {

	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return errored(res, 400, errors.array())
	}
	console.log(req.body)

	// See if the user exists
	try {
		const { name, email, password } = req.body,
			salt = await bcrypt.genSalt(10)

		let user = await User.findOne({
			email
		})

		if (user) {
			return errored(res, 400, [{ 'msg': 'User already exists' }])
		}

		// Get users gravatar
		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm'
		})

		user = new User({
			name,
			email,
			avatar,
			password: await bcrypt.hash(password, salt)
		})

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

// @route 	GET users/me
// @desc 		Test route
// @ access	Protected
router.get('/me', auth, async (req, res) => {
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

module.exports = router