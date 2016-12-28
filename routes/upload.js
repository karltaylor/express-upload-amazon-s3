const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const flow = require('flow')

const configPath = path.join(__dirname, '..', 'config.json')
AWS.config.loadFromPath(configPath)

exports.s3 = function (req, res) {
  var s3 = new AWS.S3()
  var file = req.file
  let result = {
    error: 0,
    uploaded: []
  }
  flow.exec(function () { // Read temp File
    fs.readFile(file.path, this)
  },

  function (err, data) { // Upload file to S3
    if (err) console.log(err)
    s3.putObject({
      Bucket: 'your-bucket-name', // Bucket Name
      Key: file.originalname, // Upload File Name, Default the original name
      Body: data
    }, this)
  },

  function (err, data) { // Upload Callback
    if (err) {
      console.error('Error : ' + err)
      result.error++
    }
    result.uploaded.push(data.ETag)
    this()
  },

  function () {
    res.render('result', {
      title: 'Upload Result',
      message: result.error > 0 ? 'Something is wroing, Check your server log' : 'Success!!',
      entitiyIDs: result.uploaded
    })
  })
}
