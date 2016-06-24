var mqtt    = require('mqtt');
var serport = require('./modules/serial_node');
var llap_helper = require('/modules/llap_helper');



var client  = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {	
  client.publish('presence', 'Hello mqtt');
  client.end();
});
