exports.make_return_packet = function(tf, tf_code, data) {
	var head = '{';
	var inner = '\"result\":\"' + tf + '\",' + '\"result_code\":\"' + tf_code + '\",';
	inner += '\"data\":' + data
	var tail = '}';
	
	return head + inner + tail;
};