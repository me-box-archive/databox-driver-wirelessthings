var lhelper = require('./llap_helper');
var request = require('request');

exports.init = function(io){
	
};

exports.onDataOverSerial = function(data){
	var payload = data.toString();
	
	if (lhelper.isValid(payload)) {

		var message = lhelper.message(payload);
		var jsonLLAP = {};
		
		
		var willSend = false;
		
		if(message.substring(0,4) == "TMPA" || message.substring(0,4) == "TEMP") {
			jsonLLAP.value = parseFloat(message.substring(4,9));
			jsonLLAP.unit = "degrees celcius";
			jsonLLAP.stream = "temperature";
			willSend = true;
		}

		if(message.substring(0,4) == "RHUM") {
			jsonLLAP.value = parseFloat(message.substring(4,9));
			jsonLLAP.unit = "%";
			jsonLLAP.stream = "relative_humidity";
			willSend = true;
		}

		if(message.substring(0,4) == "BATT") {
			jsonLLAP.value = parseFloat(message.substring(4,9));
			jsonLLAP.unit = "volts";
			jsonLLAP.stream = "battery";
			willSend = true;
		}

		if(willSend){
			
			jsonLLAP.node = lhelper.deviceName(payload);
			jsonLLAP.timestamp = new Date().toJSON();
			console.log(JSON.stringify(jsonLLAP));
			request.post(
			{
				url: 'http://localhost:8080/reading',
				body: jsonLLAP,
				json: true
			}, 	
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
	    			console.log(body)
				}
			});
		}
		else{
			console.log(payload);
		}		
	}
	

	else {
		console.log("message is not valid");
		console.log(message);
	}
};

