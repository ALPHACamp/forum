const express = require('express')
const app = express()
const port = 3000

const db = require('./models')

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port ${port}!`)
})