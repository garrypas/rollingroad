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

var RollingRoad = (function(Collection) {
    'use strict';
    var _testCases = [],
        _iterations = 20000, //With 50% outside the disposalRate thrown away
        _samples = 10,
        _disposalRate = 0.5,
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
        var s,
            samples = new Collection(new Array(_testCases.length)),
            t;

        for(t = 0; t < samples.count(); t++) {
            samples.element(t, []);
        }

        var addToResults = function(testCaseSample, t) {
            samples.element(t).push(testCaseSample);
        };

        for(s = 0; s < _samples; s++) {
            new Collection(_doIteration()).each(addToResults);
        }

        return samples.raw();
    };

    rollingRoad.prototype.run = function() {
        var samples = new Collection(_doSample()),
            iq = _disposalRate * 0.5,
            start = parseInt(_samples * iq),
            finish = parseInt(_samples * (1 - iq)),
            results = new Collection([]),
            testCaseSample;

        new Collection(_testCases).each(function(testCase, t) {

            testCaseSample = new Collection(samples.element(t))
            .ascending() //sorts samples
            .range(start, finish);

            var result = {
                name          : testCase.name,
                samples       : testCaseSample.count(),
                duration      : testCaseSample.sum(),
                median        : testCaseSample.median(),
                average       : testCaseSample.average(),
                mode          : testCaseSample.mode(),
                lowerquartile : testCaseSample.lowerquartile(),
                upperquartile : testCaseSample.upperquartile()
            };

            result.interquartileRange = result.upperquartile - result.lowerquartile;
            results.push(result);
        });

        _results = results.raw();
        return this;
    };

    rollingRoad.prototype.done = function(callback) {
        callback(_results);
    };

    rollingRoad.prototype.withOptions = function(options) {
        var disposalRate = typeof options.disposalRate == 'number' ? options.disposalRate : _disposalRate;
        if(disposalRate < 0 || disposalRate > 1) {
            throw new Error('The disposalRate range must be between 0 and 1 inclusive');
        }
        _disposalRate = disposalRate;

        _iterations = +options.iterations > 0 ? parseInt(options.iterations * (1 + _disposalRate)) : _iterations;
        _samples = options.samples || _samples;
        return this;
    };

    return rollingRoad;
}(Dinqyjs.Collection));

if (typeof exports === "object" && exports) {
    exports.RollingRoad = RollingRoad;
}
