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
  
  self._emitAndWait('beforeTest', function () {
    self._invokeSerial(features, function (feature, featureCb) {
      var feature = feature[Object.keys(feature).shift()];
      self._invokeSerial(feature.scenarios, function (scenario, scenarioCb) {
        if (scenario.outline) {
          scenarioCb();
        } else {
          self._invokeSerial(scenario.breakdown, function(step, stepCb) {
            var step = step[Object.keys(step).shift()],
              text = step.join(' ');

            self._executeStepDefinition(steps, step[1], stepCb);
          }, scenarioCb);
        }
      }, featureCb);
    }, 
    function (err) {
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
    return true;
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
  
  this.emit(event, function () {
    count -= 1;
    if (count === 0) {
      callback();
    }
  });
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