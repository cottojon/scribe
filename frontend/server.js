const express = require('express')
const http = require('http');
const path = require('path');

const app = express()
const port = process.env.PORT || 80;

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

const server = http.createServer(app);
server.listen(port,() => console.log(`Running on port ${port}...`));
