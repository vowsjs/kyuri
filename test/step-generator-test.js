/*
 * step-generator-test.js: Tests for the Kyuri step generator.
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
        
var readAllLines = function (filename) {
  return function () {
    fs.readFile(filename, encoding = 'ascii', this.callback);
  } 
};

vows.describe('kyuri/generator').addBatch({
  "When using the Kyuri step generator,": {
    "compiling simple.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'simple.feature')),
      "should parse correctly": function (err, data) {
        var text = data.toString();
        
        assert.isNotNull(text);
        kyuri.compile(text, { 
          directory: path.join(__dirname, 'output/steps'),
          target: 'steps'
        });
      }
    },
    "compiling complex.feature": {
      topic: readAllLines(path.join(__dirname, '..', 'examples', 'complex.feature')),
      "should parse correctly": function (err, data) {
        var text = data.toString();
        
        assert.isNotNull(text);
        kyuri.compile(text, { 
          directory: path.join(__dirname, 'output/steps'),
          target: 'steps'
        });
      }
    }
  }
}).export(module);