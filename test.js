var RollingRoad = typeof require != 'undefined' ? require('rollingroad').RollingRoad : RollingRoad;

var function1 = function() {
	var x = 0;
	x++;
};

var function2 = function() {
	var x = 0;
	x += 1;
};

if (typeof exports !== "object" || !exports) {
	var exports = {};
}

exports.runTest = function() {
	new RollingRoad({ test: function1, name : 'function1' }, { test: function2, name : 'function2' })
    	.withOptions( { iterations : 1000000, samples : 50, interquartile : 0.5 })
    	.run()
    	.done(function(results) {
    		console.log(results[0].name
    			+ '. samples: ' + results[0].samples
    			+ ' duration: ' + results[0].duration
    			+ ' median: ' + results[0].median
    			+ ' average: ' + results[0].average);

    		console.log(results[1].name
    			+ '. samples: ' + results[1].samples
    			+ ' duration: ' + results[1].duration
    			+ ' median: ' + results[1].median
    			+ ' average: ' + results[1].average);
	});
};
