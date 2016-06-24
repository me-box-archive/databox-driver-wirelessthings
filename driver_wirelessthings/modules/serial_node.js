var lhelper = require('./llap_helper');

/*
	Public API
*/
exports.getPath = function()
{
	if(serport) {
		return serport.path;
	} else {
		return "not connected";
	}
}

/*
	Private Methods
*/
var serport;
var mqtt = require('./mqtt_publisher');
var serialport = require('serialport');
var exec = require('child_process').exec;

/*
	Attempt to connect to a serial port
*/

var detectSerialOnOSX = function()
{
	var port;
	console.log('* attempting to detect a serial port on mac osx *');
	exec('ls /dev/tty.*', function(error, stdout, stderr){
		if (stdout){
			var ports = stdout.split('\n');
			for (var i = ports.length - 1; i >= 0; i--){
				if (ports[i].search('usbmodem') != -1 || ports[i].search('usbserial') != -1) port = ports[i];
			}
		}
		if (port){
			attemptConnection(port);
		}	else{
			console.log('failes to connect to serial port');
		}
	});
}

var incomingData = "";
var llapParser = function(emitter, buffer){
	incomingData += buffer.toString();
	// remove any stuff before a signature 'a' appears
	incomingData = incomingData.replace(/^[^]*?a/,'a');
	while (incomingData.length >= 12) {
		emitter.emit('data',incomingData.substr(0,12));
		incomingData = incomingData.substr(12).replace(/^[^]*?a/,'a');
	}
}

var attemptConnection = function(port)
{
	console.log('* attempting to connect to serial at :', port, ' *');
	serport = new serialport.SerialPort(port, { baudrate: 9600, parser: llapParser });
	serport.on("open", function () {
		console.log('* connection to a serial port successful ! *');
		serport.on('data', function(data){
			mqtt.onDataOverSerial(data);
		});
	});
}

mqtt.init();
detectSerialOnOSX();
