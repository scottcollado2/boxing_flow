const mongoose = require('mongoose'),
	UserSchema = new mongoose.Schema({
		name: {
			type: String,
			require: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			require: true
		},
		avatar: {
			type: String
		},
		date: {
			type: Date,
			default: Date.now()
		}
	})

// eslint-disable-next-line no-undef
module.exports = User = mongoose.model('user', UserSchema)