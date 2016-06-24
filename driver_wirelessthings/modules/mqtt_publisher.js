var serport = require('./serial_node');
var lhelper = require('./llap_helper');
var request = require('request');

exports.init = function(io){
	
};

exports.onDataOverSerial = function(data){
	var payload = data.toString();
	console.log(payload);
	if (lhelper.isValid(payload)) {

		var message = lhelper.message(payload);
		if(message.substring(0,4) == "TMPA" || message.substring(0,4) == "TEMP") {
			var jsonLLAP = {};
			jsonLLAP.value = parseFloat(message.substring(4,9));
			jsonLLAP.node = lhelper.deviceName(payload);
			jsonLLAP.timestamp = new Date().toJSON();
			jsonLLAP.unit = "degrees celcius";
			jsonLLAP.stream = "temperature";
			console.log(JSON.stringify(jsonLLAP));
			request.post({
				url: 'http://localhost:8080/reading',
				body: jsonLLAP,
				json: true
			}, 	function (error, response, body) {
    				if (!error && response.statusCode == 200) {
        				console.log(body)
    				}
				});
		}

	}
	else {
		console.log("message is not valid");
		console.log(message);
	}
};

