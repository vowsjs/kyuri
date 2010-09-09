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
};

vows.describe('kyuri/parser').addBatch({
  "When using the Kyuri step definitions,": {
    "running vows created from simple.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'simple.feature')),
      "should return proper vows": function (err, data) {
        var text = data.toString();
        assert.isNotNull(text);

        var suite = kyuri.runners.vows.createVows('simple.feature', kyuri.parse(data.toString()).ast);        
        assert.equal(suite.batches.length, 1);
      }
    }
  }
}).export(module);