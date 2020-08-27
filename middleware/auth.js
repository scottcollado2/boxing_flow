const jwt = require('jsonwebtoken'),
	config = require('config'),
	{ errored } = require('../config/globalFunc')


module.exports = (req, res, next) => {
	const token = req.header('x-auth-token')

	if (!token) {
		return errored(res, 401, [{ msg: 'Authorization Denied, Invalid Token' }])
	}

	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'))

		req.user = decoded.user
		next()
	} catch (e) {
		return errored(res, 401, [{ msg: 'Authorization Denied, Invalid Token' }])
	}
}