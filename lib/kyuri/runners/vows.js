/*
 * vows.js: Methods for interacting with vows during test execution.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var vows = require('vows'),
    assert = require('assert'),
    eyes = require('eyes');

//
// Attempts to match against the pattern. If a match 
// is found it should then merge the topics together 
// and call the step generator with the merged topic 
// and any matches.
//
var mergingTopic = function (step, text, topics) {
  var match, topic = {};
  if(!(match = step.pattern.match(text))) {
    return;
  }

  topics.forEach(function (item) { topic.merge(item) });
  
  return function () {
    step.generator.call(this, topic, match.slice(1));
  };
};

exports.findStep = function (text, steps) {
  
};

exports.createVows = function (filename, features) {
  // For each set of features in a single file (i.e. module) 
  // setup the vows suite to export or run
  var suite = vows.describe(filename);
  Object.keys(features).forEach(function (i) {
    // For each feature create a new batch
    var feature = features[i],
        batch = {};
        
    feature.scenarios.forEach(function (scenario) {
      // For each scenario in the feature, add a context for that scenario
      // at the same level: top-level contexts that can be run concurrently.
      batch[scenario.name] = exports.scenarioVows(scenario);
    });
    
    // The the batch representing the feature to the suite 
    suite.addBatch(batch);
  });  
  
  return suite;
};

exports.scenarioVows = function (scenario) {
  // Create root context, and set current context to it.
  var context = {}, current = context, then = false;
  
  if (scenario.outline) {
    // If the scenario is a 'Scenario Outline'
    
  }
  else {
    // Otherwise if it is just a 'Scenario'
    scenario.breakdown.forEach(function (breakdown) {
      var breakdown = breakdown[Object.keys(breakdown).shift()],
          text = breakdown.join(' ');
      
      // Remark: i18n compatibility here
      if(breakdown[0] === 'THEN') {
        then = true;
      }
      
      if (!then) {
        // If we haven't seen 'then' we must make these nested contexts
        current[text] = { 
          topic: text //exports.findStep(text, steps)
        };
        
        current = current[text];
      }
      else {
        // If we have passed a 'then' keyword, we can now add tests to this context
        current[text] = text //exports.findStep(text, steps);
      }
    });
  }
  
  return context;
};