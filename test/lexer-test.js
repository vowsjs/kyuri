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

vows.describe('kyuri/lexer').addBatch({
  "When using the Kyuri lexer,": {
    "lexing simple.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'simple.feature')),
      "should lex correctly": function (err, data) {
        assert.isNotNull(data.toString());
        eyes.inspect(kyuri.tokens(data.toString()));
      }
    }
  }
}).export(module);
