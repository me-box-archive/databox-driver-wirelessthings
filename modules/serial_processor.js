var lhelper = require('./llap_helper');
var request = require('request');
var databox_directory = require('../utils/databox_directory.js');

var DATASTORE_TIMESERIES_ENDPOINT = process.env.DATASTORE_TIMESERIES_ENDPOINT;

var vendor_id;
var driver_id;
var datastore_id;
var sensor_types = [];
var registered_sensors = [];
var all_registered = false;

function saveReading(s_id,v_id,data) {
	var options = {
	  uri: DATASTORE_TIMESERIES_ENDPOINT + '/data',
	  method: 'POST',
	  json: 
	  {
	    sensor_id: s_id, 
	    vendor_id: v_id, 
	    data: data   
	  }
	};
	request.post(options, (error, response, body) => {console.log(error, body)});
}


exports.onDataOverSerial = function(data){
	var payload = data.toString();
	var ok_to_post = true;
	
	if (lhelper.isValid(payload)) {
		var message = lhelper.message(payload);
		var device_id = lhelper.deviceName(payload);
		var llap_code = message.substring(0,4);
		var sensor_value;

		switch(llap_code) {
			case "TMPA":
			case "TEMP":
			case "RHUM":
			case "BATT":
				sensor_value = parseFloat(message.substring(4,9));
			case "TILT":
				if(message.substring(4,6) == "OFF")
					sensor_value = 0;
				if(message.substring(4,5) == "ON")
					sensor_value = 1;
				break;
			default: 
				ok_to_post = false;
				break;
		}

		if(ok_to_post) {
			local_sensor_id = device_id + "-" + llap_code;
			if(registered_sensors[local_sensor_id]) {
				saveReading(registered_sensors[local_sensor_id], this.vendor_id, sensor_value);
			} 
			else {
				//register the sensor then post the data
				var sensor_type_id;
				var unit;
				var short_unit;
				var description = "wireless things sensor";
				var location = "unknown"
				switch(llap_code) {
					case "TMPA":
					case "TEMP":
						sensor_type_id = sensor_types["temperature"];
						unit = "Degrees Celcius";
						short_unit = "ºC";
						break;
					case "RHUM":
						sensor_type_id = sensor_types["humidity"];
						unit = "Relative Humidity";
						short_unit = "%";
						break;
					case "BATT":
						sensor_type_id = sensor_types["battery"];
						unit = "Volts";
						short_unit = "V";
						break;
					case "TILT":
						sensor_type_id = sensor_types["tilt"];
						unit = "na";
						short_unit = "na";
						break; 
					case "BATT":
						sensor_value = parseFloat(message.substring(4,9));
					default: 
						console.log("impossible");
						break;
				} // end of switch

				databox_directory.register_sensor(this.driver_id, sensor_type_id, this.datastore_id, this.vendor_id, local_sensor_id, unit, short_unit, description, location, function (result) {
					registered_sensors[local_sensor_id] = result.id;
					saveReading(result.id, this.vendor_id, sensor_value);
				})

			} // end of sensor not registered

		} // end of ok to post

	};
};

exports.update_ids = function (vendor, driver, datastore , sensor_types) {
	this.vendor_id = vendor;
	this.driver_id = driver;
	this.datastore_id = datastore;
	this.sensor_types = sensor_types;
	this.all_registered = true;

};
