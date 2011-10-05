/*
 * simple-lexer-test.js: Simple tests for the Kyuri lexer.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));

var kyuri = require('kyuri'),
    vows = require('vows'),
    assert = require('assert'),
    eyes = require('eyes');
    
var exampleRowTopic = function (row, values) {
  return {
    topic: kyuri.tokens(row),
    "should be the right kind of row": function(tokens) {
      assert.equal(tokens[0][0], 'EXAMPLE_ROW');
    },
    "should create valid tokens": function(tokens) {
      assert.instanceOf(tokens, Array);
      assert.equal(tokens.length, 3);
    },
    "should create the right token values": function(tokens) {
      var lexedValues = tokens[0][1];

      assert.equal(values.length, lexedValues.length);
      for (var i = 0; i < values.length; i++) {
        assert.equal(lexedValues[i], values[i]);
      }
    }
  };  
}

vows.describe('kyuri/lexer/simple').addBatch({
  "When using the Kyuri lexer": {
    "a feature token": {
      topic: kyuri.tokens('Feature: Addition boi'),
      "should be respond with a single token literal": function (tokens) {
        assert.instanceOf(tokens, Array);
        assert.equal(tokens.length, 4);
      }
    },
    "a scenario token": {
      topic: kyuri.tokens('Scenario: Simple math boi'),
      "should be respond with a single token literal": function (tokens) {
        assert.instanceOf(tokens, Array);
        assert.equal(tokens.length, 4);
      }
    },
    "a tag token": {
      topic: kyuri.tokens('@tag1'),
      "should create a single token literal": function(tokens) {
        assert.instanceOf(tokens, Array);
        assert.equal(tokens.length, 3);
      }
    },
    "two tags": {
      topic: kyuri.tokens('@tag1 @tag2'),
      "should create two tag tokens": function(tokens) {
        assert.instanceOf(tokens, Array);
        assert.equal(tokens.length, 4);
      }
    },
    "a step with an '@' symbol": {
      topic: kyuri.tokens('Given I have a user with email address "paul@done.com"'),
      "should create a single token literal": function(tokens) {
        assert.instanceOf(tokens, Array);
        assert.equal(tokens.length, 4);
      }
    },
    "a simple example row": exampleRowTopic('| title | element1 | element2 |', ['title', 'element1', 'element2']),
    "an example row with spaces": exampleRowTopic('| title 1 | element 1 |', ['title 1', 'element 1']),
    "an example row with blank elements": exampleRowTopic('| title |      |', ['title', ''])
  }
}).export(module);