var RollingRoad = typeof require != 'undefined' ? require('./rollingroad.js').RollingRoad : RollingRoad;

var isNode = typeof exports === "object" && exports;

var function1 = function() {
	var x = 0;
	x++;
};

var function2 = function() {
	var x = 0;
	x += 1;
};

if (!isNode) {
	var exports = {};
}

exports.runTest = function() {
	new RollingRoad({ test: function1, name : 'function1' }, { test: function2, name : 'function2' })
    	.withOptions( { iterations : 1000000, samples : 50, disposalRate : 0.5 })
    	.run()
    	.done(function(results) {
    		console.log(results[0].name
    			+ '. samples: ' + results[0].samples
    			+ ' duration: ' + results[0].duration
    			+ ' median: ' + results[0].median
    			+ ' average: ' + results[0].average
				+ ' lower quartile: ' + results[0].lowerquartile
				+ ' interquartile range: ' + results[0].interquartileRange
				+ ' upper quartile: ' + results[0].upperquartile
				+ ' mode: ' + results[0].mode.join(','));

    		console.log(results[1].name
    			+ '. samples: ' + results[1].samples
    			+ ' duration: ' + results[1].duration
    			+ ' median: ' + results[1].median
    			+ ' average: ' + results[1].average
				+ ' lower quartile: ' + results[1].lowerquartile
				+ ' interquartile range: ' + results[1].interquartileRange
				+ ' upper quartile: ' + results[1].upperquartile
				+ ' mode: ' + results[1].mode.join(','));
	});
};

if (isNode) {
	exports.runTest();
}
