/*
 * steps.js: Wrapper functions for Kyuri step definitions.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var steps = [];
exports.Given = function (pattern, topicGenerator) {
  steps.push({
    operator: 'Given',
    pattern: pattern,
    generator: topicGenerator
  });
};

exports.When = function (pattern, topicGenerator) {
  steps.push({
    operator: 'When',
    pattern: pattern,
    generator: topicGenerator
  });
};

exports.Then = function (pattern, callbackGenerator) {
  steps.push({
    operator: 'Then',
    pattern: pattern,
    generator: callbackGenerator
  });
};

exports.export = function (module) {
  module.exports = steps;
};