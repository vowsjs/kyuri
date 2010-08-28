/*
 * lexer.js: Custom regular expression based lexer for Kyuri
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var eyes = require('eyes');
var Lexer = function (i8n) {
  // Set the i8n dictionary on the lexer for later use
  this.i8n = i8n;
  
  // Set the keyword type list on the lexer for later use
  this.tokens = ['examples', 'feature', 'but', 'and', 'scenario_outline', 'background', 'when', 'then', 'given', 'scenario']
  
  // Initialize the set of keywords in the lexer
  this.keywords = {};
  for (var i = 0; i < this.tokens.length; i++) {
    this.keywords[this.tokens[i]] = [];
  }
    
  // Build up the set of keywords from each language
  for (var lang in i8n) {
    for (var key in i8n[lang]) {
      if (typeof this.keywords[key] !== 'undefined') {
        this.keywords[key].unshift(i8n[lang][key]);
      }
    }
  };
};

Lexer.prototype = {
  tokenize: function (source) {
    
  }
};

exports.Lexer = Lexer;