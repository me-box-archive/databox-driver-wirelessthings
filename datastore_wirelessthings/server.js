
/* http server setup */
var http = require('http');
var dispatcher = require('httpdispatcher');
var jsonfile = require('jsonfile');
var express = require('express');
var bodyParser = require('body-parser');

/* influx db connector setup*/
var influx = require('influx')
var influxClient = influx({
  host : 'localhost',
  port : 8086, 
  protocol : 'http',
  database : 'databox'
});

/* mqtt publisher setup */
var mqtt    = require('mqtt');
mqttClient  = mqtt.connect('mqtt://localhost');

var app = express();
const PORT=8080; 

var jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/options", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var file = 'options.js';
    jsonfile.readFile(file, function (err, obj) {
    	res.end(JSON.stringify(obj, null, 3));
    });
});    

app.post("/reading", jsonParser, function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.body.value);
    // need to add validation here
    var timestamp = new Date(req.body.timestamp); 
    console.log(timestamp.getHours());
    console.log(timestamp.getMinutes());
    influxClient.writePoint(req.body.stream, {time: timestamp, value: req.body.value}, {unit: req.body.unit, node: req.body.node},function(err,response) { });
    var clientURL = req.body.stream+"/"+req.body.node;
    mqttClient.publish(clientURL,JSON.stringify({time: timestamp, value: req.body.value, unit: req.body.unit}));
    res.end('OK');
});

app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});