The Rolling Road Javascript library
===================================

This is a very simple benchmarking tool for comparing Javascript functions against one-another.

The repo contains examples both in the browser (browser-example.html) and in node (run node node-example.js).

Dependencies
------------

Rolling Road has a dependency on dinqyjs which must be at least version v1.2.0. You can find this library on Github too, which itself has no dependencies.

Usage
-----

The .withOptions part of the code is optional. Without these defaults will be used.

Each sample loops over the function repeatedly (which you can adjust by specifying iterations). At the end of the sample the tool checks how many milleseconds have passed.

For simple functions a large number of iterations compared to samples is preferable. For more complex functions fewer iterations are necessary to get meaningful results.

The interquartile is used to stop the statistics being skewed by outliers using a pretty crude but effective approach. The value of 0.5 supplied here tells the tool to throw away the top and bottom 25% of results from a sample and keep the middle 50%. Choose a value between 0 and 1. A small value will give more accurate results, but is wasteful. A good guide is to benchmark the same function and ensure the outputs are roughly equal.

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
	
Results
-----------
	
3 metrics are offered in the resultset for each test case. The total duration of all samples combined, the median duration each sample took to run and the average time each sample took to run.

Results should only be taken as a guide and may differ from machine to machine.
