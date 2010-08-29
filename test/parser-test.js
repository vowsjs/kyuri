/*
 * lexer-test.js: More complex tests for the Kyuri lexer.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));

var kyuri = require('kyuri'),
    fs = require('fs'),
    path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    eyes = require('eyes');
    
var readAllLines = function (filename) {
  return function () {
    fs.readFile(filename, encoding = 'ascii', this.callback);
  } 
}

vows.describe('kyuri/parser').addBatch({
  "When using the Kyuri parser,": {
    "parsing simple.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'simple.feature')),
      "should parse correctly": function (err, data) {
        assert.isNotNull(data.toString());
        eyes.inspect(kyuri.parse(data.toString()));
      }
    },
    "parsing complex.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'complex.feature')),
      "should parse correctly": function (err, data) {
        assert.isNotNull(data.toString());
        eyes.inspect(kyuri.parse(data.toString()));
      }
    }
  }
}).export(module);