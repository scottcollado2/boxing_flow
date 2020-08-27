/**
 * 
 * @param {Object} res 
 * @param {Integer} statusCode 
 * @param {Array} errors 
 */
function errored(res, statusCode, errors) {
	return res.status(statusCode)
		.json({ errors })
}

module.exports = {
	errored
}