/*
	LLAP helper functions: Public API
 */

exports.fixSignature = function(msg){
	if(! /^a/.test(msg) ) { msg = 'a'+msg; }
	return msg;
}

exports.padMessage = function(msg,filler) {
	if(!filler) { var filler = '-'; }
	for (var i=0; i<12; i++) { msg += filler; }
	return msg.substring(0,12);
}

exports.deviceName = function(msg) {
	return msg.substring(1,3);
}

exports.message = function(msg,filler) {
	if(!filler) { var filler = '-'; }
	return msg.substring(3,12).replace(/-*$/,"");
}

exports.isValid = function(msg) {
	return msg.length == 12 &&
		msg.charAt(0) == 'a' &&
		isAllowedID(exports.deviceName(msg)) &&
		isAllowedData(msg.substring(3));
}

/*
	Private
 */

var isAllowedID = function(str) {
	return str.length == 2 &&
		/[A-Z-#@?\\*]{2}/.test(str);
}

var isAllowedData = function(str) {
	return str.length == 9 &&
		/[0-9A-Z !"#$%&'()*+,\-.\/:;<=>?@[\\\]^_]{9}/.test(str);
}