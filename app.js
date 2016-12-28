/**
 * Module dependencies.
 */

const express = require('express')
const routes = require('./routes')
const multer = require('multer')
const upload = require('./routes/upload')
const http = require('http')
const path = require('path')

var uploader = multer({
  dest: 'uploads/'
})

var app = express()

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', routes.index)
app.post('/upload', uploader.single('singleFile'), upload.s3) // "singleFile" is the field name

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port http://localhost:' + app.get('port'))
})
