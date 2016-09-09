var express = require('express');
var router = express.Router();
var actuator_type = require('../models/sensor_reading.js');

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/options", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var file = '../options.js';
    jsonfile.readFile(file, function (err, obj) {
      res.end(JSON.stringify(obj, null, 3));
    });
});    

app.post("/reading", jsonParser, function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.body.value);
    /* TODO: 
    Varify that reading is allowed to be made, is sensor and type etc registered with the databox_directory
    */

    var timestamp = new Date(req.body.timestamp); 
    console.log(timestamp.getHours());
    console.log(timestamp.getMinutes());
    influxClient.writePoint(req.body.stream, {time: timestamp, value: req.body.value}, {unit: req.body.unit, node: req.body.node},function(err,response) { });
    var clientURL = req.body.stream+"/"+req.body.node;
    mqttClient.publish(clientURL,JSON.stringify({time: timestamp, value: req.body.value, unit: req.body.unit}));
    res.end('OK');
});

module.exports = router;
