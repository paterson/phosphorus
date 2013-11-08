express = require('express')
redis = require('redis')
app = express()

client = redis.createClient(6379, 'localhost')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

app.use(express.bodyParser())
app.use(allowCrossDomain)

app.post('/get', function (req, res) {
  client.get(req.body.token.toString() + ":" + req.body.key.toString(), function(err, value) {
    res.json(JSON.parse(value))
    res.end()
  })
})

app.post('/set', function (req, res) {
  var key = req.body.token.toString() + ":" + req.body.key.toString()
  client.set(key, JSON.stringify(req.body.value))
  io.sockets.emit(key, req.body.value)
  res.end()
})


var server = app.listen(process.env.PORT || 80)
var io = require('socket.io').listen(server)
