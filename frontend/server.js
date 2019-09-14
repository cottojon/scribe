const express = require('express')
const http = require('http');
const path = require('path');

const app = express()
const port = process.env.PORT || 80;

const db = require('./queries');
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/dist/Scribe'));
app.get('/*', (req,res) => {
  res.sendFile(path.join(__dirname));
  console.log(req.url);
});

app.get('/api/clips', db.getClips);
app.post('/api/clips', db.createClip);
app.put('/api/clips', db.updateClip);
app.delete('/api/clips', db.removeClip);


app.get('/api/channels', db.getChannels);


app.get('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  res.send("Secret found");
  next() // pass control to the next handler
})

const server = http.createServer(app);
server.listen(port,() => console.log('Running...'));
