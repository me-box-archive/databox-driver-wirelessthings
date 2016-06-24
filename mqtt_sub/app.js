var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {
  var channel = "temperature/AA";
  client.subscribe(channel);
  console.log('client is subscribed to channel '+channel);
});
 
client.on('message', function (topic, message) {
  console.log(message.toString());
  //client.end();
});