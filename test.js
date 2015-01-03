var RollingRoad = typeof require != 'undefined' ? require('./rollingroad.js').RollingRoad : RollingRoad;

var function1 = function() {
	var x = 0;
	x++;
};

var function2 = function() {
	var x = 0;
	x++;
};

if (typeof exports !== "object" || !exports) {
	var exports = {};
}

exports.runTest = function() {
	new RollingRoad({ test: function1, name : 'function1' }, { test: function2, name : 'function2' })
    	.withOptions( { iterations : 100000, samples : 20 })
    	.run()
    	.done(function(results) {
    		console.log(results[0].name + ': samples: ' + results[0].samples + ' duration: ' + results[0].duration);
    		console.log(results[1].name + ': samples: ' + results[1].samples + ' duration: ' + results[1].duration);
	});
};