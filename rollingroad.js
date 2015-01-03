var RollingRoad = (function() {
    'use strict';
    var _testCases = [],
        _iterations = 10000,
        _samples = 5,
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
        var samples = new Array(_samples),
            s;
        for(s = 0; s < _samples; s++) {
            samples[s] = _doIteration();
        }
        return samples;
    };
    
    rollingRoad.prototype.run = function() {
        var testCasesLength = _testCases.length,
            samples = _doSample(),
            results = new Array(testCasesLength),
            t,
            s;
        for(t = 0; t < testCasesLength; t++) {
            results[t] = { name : _testCases[t].name,
                          samples : 0, duration : 0 };
            for(s = 0; s < samples.length; s++) {
                results[t].samples ++;
                results[t].duration += samples[s][t];
            }
        }
        _results = results;
        return this;
    };
    
    rollingRoad.prototype.done = function(callback) {
        callback(_results);
    };
    
    rollingRoad.prototype.withOptions = function(options) { 
        _samples = options.samples || _samples;
        _iterations = options.iterations || _iterations;
        return this;
    };
    
    return rollingRoad;
}());
if (typeof exports === "object" && exports) {
    exports.RollingRoad = RollingRoad;
}