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
    inspect = require('eyes').inspector({
      styles: {
        all:     'cyan',      // Overall style applied to everything
        label:   'underline', // Inspection labels, like 'array' in `array: [1, 2, 3]`
        other:   'inverted',  // Objects which don't have a literal representation, such as functions
        key:     'bold',      // The keys in object literals, like 'a' in `{a: 1}`

        special: 'grey',      // null, undefined...
        string:  'green',
        number:  'magenta',
        bool:    'blue',      // true false
        regexp:  'green',     // /\d+/
      },
      maxLength: 4096
    });
        
var parseAllLines = function (filename) {
  return function () {
    var that = this;
    fs.readFile(filename, encoding = 'ascii', function (err, data) {
      if (err) return that.callback(err);
      that.callback(null, kyuri.parse(data.toString()));
    });
  } 
};

vows.describe('kyuri/parser').addBatch({
  "When using the Kyuri parser,": {
    "parsing simple.feature": {
      topic: parseAllLines(path.join(__dirname, '..', 'examples', 'simple.feature')),
      "should parse correctly": function (err, ast) {
        assert.isNull(err);
        assert.isObject(ast);  
        assert.include(ast, 1);
      }
    },
    "parsing complex.feature": {
      topic: parseAllLines(path.join(__dirname, '..', 'examples', 'complex.feature')),
      "should parse correctly": function (err, ast) {
        assert.isNull(err);
        assert.isObject(ast);  
        assert.include(ast, 1);
      }
    }
  }
}).export(module);