const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookiesParser = require('cookie-parser')

const authRoute = require('./routes/authRoute')
const tableRoute = require('./routes/tableRoute')

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookiesParser())


app.use('/auth', authRoute)
app.use('/tables', tableRoute)

app.get('/', (req, res) => {
    res.send('hello')
})


app.listen(process.env.SERVER_PORT, () => {
    console.log(`App is running on port ${process.env.SERVER_PORT}`)
})
