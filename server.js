const { connectDB } = require('./config/db'),
	express = require('express'),
	app = express(),
	PORT = process.env.PORT || 5000

// Connect DB
connectDB()

//Init Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/combos', require('./routes/api/combos'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))