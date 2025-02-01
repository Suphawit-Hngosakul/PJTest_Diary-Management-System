const express = require('express')
const cors = require('cors')

const app = express()

const port = process.env.port || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})