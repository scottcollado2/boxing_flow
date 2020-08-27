const express = require('express'),
	router = express.Router()

// @route 	GET api/combos
// @desc 		Test route
// @ access	Public
router.get('/', (req, res) => res.send('Combos route'))


module.exports = router