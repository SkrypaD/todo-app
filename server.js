const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()



app.get('/', (req, res) => {
    res.send('hello')
})


app.listen(process.env.SERVER_PORT, () => {
    console.log(`App is running on port ${process.env.SERVER_PORT}`)
})
