const express = require('express'),
	router = express.Router(),
	auth = require('../../middleware/auth'),
	User = require('../../models/User')

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


module.exports = router