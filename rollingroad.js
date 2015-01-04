/*!
 * Rolling Road JavaScript Library v1.0.1
 *
 * Copyright (c) 2014 Garry Passarella
 * Released under the MIT license
 * 
 * Ensure dinqyjs is included. Download at https://github.com/garrypas/dinqyjs
 * and include in the head section of your .html document. If you are running in
 * Node and have installed with NPM you should get the dependency automatically.
 * If not install by running 'npm install dinqyjs'
 *
 * Date: 2015-01-03
 */
var Dinqyjs = typeof require != 'undefined' ? require('dinqyjs').Dinqyjs : Dinqyjs;

var RollingRoad = (function($collection) {
    'use strict';
    var _testCases = [],
        _iterations = 20000, //With 50% outside the interquartile thrown away
        _samples = 10,
        _interquartile = 0.5,
        _results;

    var rollingRoad = function() {
        var args = [0, _testCases.length].concat(Array.prototype.slice.call(arguments));
        Array.prototype.splice.apply(_testCases, args);
    };

    var now = function() {
        return new Date().getTime();
    };
    
    var _doIteration = function() {
        var testCasesLength = _testCases.length,
            ops = new Array(testCasesLength),
            t,
            time,
            i;
        
        for(t = 0; t < testCasesLength; t++) {
            time = now();
            for(i = 0; i < _iterations; i++) {
                _testCases[t].test();
            }
            ops[t] = (typeof ops[t] == 'undefined' ? 0 : ops[t]) + (now() - time);
        }
        return ops;
    };
    
    var _doSample = function() {
        var s = 0,
            samples = new $collection(new Array(_testCases.length)),
            t;

        for(t = 0; t < samples.count(); t++) {
            samples.element(t, []);
        }

        for(s = 0; s < _samples; s++) {
            new $collection(_doIteration()).each(function(testCaseSample, t) {
                samples.element(t).push(testCaseSample);
            });
        }

        return samples.raw();
    };
    
    rollingRoad.prototype.run = function() {
        var testCasesLength = _testCases.length,
            samples = new $collection(_doSample()),
            iq = _interquartile * .5,
            start = parseInt(_samples * iq),
            finish = parseInt(_samples * (1 - iq)),
            results = new $collection([]),
            t,
            s,
            last,
            filtered;

        new $collection(_testCases).each(function(testCase, t) {
            var result = {
                name : testCase.name,
                samples : 0,
                duration : 0
            };
            results.push(result);

            var testCaseSample = new $collection(samples.element(t))
            .ascending() //sorts samples
            .range(start, finish);

            result.samples = testCaseSample.count();
            result.duration = testCaseSample.sum();
            result.median = testCaseSample.median();
            result.average = testCaseSample.average();
        });

        _results = results.raw();
        return this;
    };
    
    rollingRoad.prototype.done = function(callback) {
        callback(_results);
    };
    
    rollingRoad.prototype.withOptions = function(options) {
        var interquartile = typeof options.interquartile == 'number' ? options.interquartile : _interquartile;
        if(interquartile < 0 || interquartile > 1) {
            throw new Error('The interquartile range must be between 0 and 1 inclusive');
        }
        _interquartile = interquartile;

        _iterations = +options.iterations > 0 ? parseInt(options.iterations * (1 + _interquartile)) : _iterations;
        _samples = options.samples || _samples;
        return this;
    };
    
    return rollingRoad;
}(Dinqyjs.Collection));
if (typeof exports === "object" && exports) {
    exports.RollingRoad = RollingRoad;
}