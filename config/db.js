const mongoose = require('mongoose'),
	config = require('config'),
	db = config.get('mongoURI'),

	connectDB = async () => {
		try {
			await mongoose.connect(db, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true
			})
			console.log('mongodb connected..')
		} catch (e) {
			console.error(e.message)

			process.exit(1)
		}
	}

module.exports = {
	connectDB
}