const express = require('express')

const app = express()
const port = process.env.PORT || 8080
const router = express.Router()

app.use(express.static(`dist`))

app.engine('.html', require('ejs').renderFile)

app.set('views', `dist`)

router.get('/*', (req, res, next) => {
	res.sendFile(`dist/index.html`)
})

app.use('/', router)

app.listen(port)

console.log('App running on port', port)