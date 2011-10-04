/*
 * cucumber.js: Methods for directly running features against a Cucumber layout.
 *
 * (C) 2011 Paul Covell (paul@done.com)
 * MIT LICENSE
 *
 */
var kyuri = require('kyuri'),
  fs = require('fs'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

var Cucumber = function () {
  EventEmitter.call(this);
  this.missingSteps = [];
};
util.inherits(Cucumber, EventEmitter);

/**
  Runs the parsed feature files provided with the steps 
*/
Cucumber.prototype.run = function (features, steps, callback) {
  var self = this;
  
  function runFeatures (features, next) {
    self._invokeSerial(features, function (feature, featureCb) {
      var feature = feature[Object.keys(feature).shift()];      
      runScenarios(feature, featureCb);
    }, next);
  }
  
  function runBackground (feature, next) {
    if (feature.background) {
      self._emitAndWait('beforeBackground', function() {
        self._invokeSerial(feature.background.breakdown, runStep, next);
      });
    } else {
      next();
    }
  }
  
  function runScenarios (feature, next) {
    self._invokeSerial(feature.scenarios, function (scenario, scenarioCb) {
      if (scenario.outline) {
        self._invokeSerial(scenario.examples, function (example, exampleCb) {
          var steps = []
          
          // Create customized steps by replacing the template steps with
          // the example variables
          scenario.breakdown.forEach(function (step) {
            var exampleStep = {};
            Object.keys(step).forEach(function (i) {
              exampleStep[i] = step[i].slice(0); // copy the array
              scenario.exampleVariables.forEach(function (variable) {
                exampleStep[i][1] = exampleStep[i][1].replace('\<' + variable + '\>', example[variable]);
              });
            });
            steps.push(exampleStep);
          });
          
          runBackground(feature, function (err) {
            self._invokeSerial(steps, runStep, exampleCb);
          });
        }, scenarioCb);
      } else {
        runBackground(feature, function (err) {
          self._invokeSerial(scenario.breakdown, runStep, scenarioCb);
        });
      }
    }, next);
  }
  
  function runStep (step, next) {
    var step = step[Object.keys(step).shift()];
    self._executeStepDefinition(steps, step[1], next);
  }
  
  self._emitAndWait('beforeTest', function () {
    runFeatures(features, function (err) {
      self._emitAndWait('afterTest', function() {
        if (self.missingSteps.length > 0) {
          console.log('Missing Steps');
          console.log(self.missingSteps.join('\n'));
        }
        callback(err);        
      });
    });
  });
};

/**
  Run the matching step definition, if any
*/
Cucumber.prototype._executeStepDefinition = function (steps, step, callback) {
  var stepContext, fn, matches;
  var self = this;
  
  steps.forEach(function (rule) {
    if (!fn) {
      matches = step.match(rule.pattern);
      if (matches) {
        fn = rule.generator;
      } else {
        if (self.missingSteps.indexOf(step) === (-1)) {
          self.missingSteps.push(step);
        }
      }
    };
  });
  
  stepContext = {
    done : callback,
    pending : callback,
  };
  
  if (fn) {
    matches = matches.slice(1);
    matches.unshift(stepContext);
    fn.apply(this, matches);
  } else {
    stepContext.pending();
  }
};

/**
  Map function over each item in the array in order, calling callback when complete
  fn = function (item, callback)
*/
Cucumber.prototype._invokeSerial = function (ar, fn, callback) {
  (function (ar, fn, callback) {
    var context = this,
      i = -1;

    function _callback(err) {
      i += 1;
      if (!err && i < ar.length) {
        fn.call(context, ar[i], _callback);
      } else {
        callback(err);
      }
    };

    _callback();
  }).call(this, ar, fn, callback);
};

Cucumber.prototype._emitAndWait = function (event, callback) {
  var count = this.listeners(event).length;
  
  if (count === 0) {
    callback();
  } else {
    this.emit(event, function () {
      count -= 1;
      if (count === 0) {
        callback();
      }
    });
  }
};

/**
  Invoke function with all items in the array, calling callback when complete
  fn = function (item, callback)
*/
Cucumber.prototype._invokeParallel = function (ar, fn, callback) {
  (function (ar, fn, callback) {
    var context = this,
      count = 0;
      
    ar.forEach(function (item) {
      fn.call(context, item, function (err) {
        count += 1;
        if (count >= ar.length) {
          callback();
        }
      });
    });
  }).call(this, ar, fn, callback);
};

module.exports = new Cucumber();