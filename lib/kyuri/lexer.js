/*
 * lexer.js: Custom regular expression based lexer for Kyuri
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var helpers = require('./helpers'),
    sys = require('sys'),
    eyes = require('eyes');

var MULTI_DENT = /^((\n([ \t]*))+)(\.)?/,
    LAST_DENTS = /\n([ \t]*)/g,
    LAST_DENT  = /\n([ \t]*)/;

var Lexer = function (i18n) {
  // Set the i18n dictionary on the lexer for later use
  this.i18n = i18n;
  
  // Set the keyword type list on the lexer for later use
  this.operators = ['but', 'and', 'when', 'then', 'given'];
  this.tokens = this.operators.concat(['examples', 'background', 'feature', 'scenario_outline', 'scenario']);
  
  // Initialize the set of keywords in the lexer
  this.keywords = {};
  for (var i = 0; i < this.tokens.length; i++) {
    this.keywords[this.tokens[i]] = [];
  }
    
  // Build up the set of keywords from each language
  for (var lang in i18n) {
    for (var key in i18n[lang]) {
      if (typeof this.keywords[key] !== 'undefined') {
        this.keywords[key].unshift(i18n[lang][key]);
      }
    }
  };
  
  // Build up the set of regular expressions for matching
  // the entire set of i18n keyword tokens. This overwrites
  // the set of keywords with regular expressions matching
  // that set of keywords
  this.matchers = {};
  for (var key in this.keywords) {
    var concat = '';
    for (var i = 0; i < this.keywords[key].length; i++) {
      concat += this.keywords[key][i].replace('*|', '') + '|';
    }
    
    this.keywords[key] = new RegExp(concat, 'i');
    
    concat = '(' + concat + ')(\\:\\s+)([\\w+\\s+]+[\\w+])';
    this.matchers[key] = new RegExp(concat, 'i');
  }
};

Lexer.prototype = {
  tokenize: function (source, options) {
    if (!source) {
      throw new Error('Cannot lex null or undefined.');
    }
    
    source = source.replace(/(\r|\s+$)/g, '');
    this.options = options || {};  // Options passed to the lexer
    this.source = source;          // Source code we are attempting to lex
    this.i = 0;                    // Current character position
    this.line = 0;                 // Line number of the lexing operation
    this.indent = 0;               // Number of indents
    this.tokens = [];              // Stream of parsed tokens in the form ['TYPE', value, line]
    
    while (this.i < this.source.length) {
      //eyes.inspect(this.i);
      //eyes.inspect(this.source.length);
      this.chunk = this.source.slice(this.i);
      this.extractNextToken();
    }
    
    return this.tokens;
  },
  
  extractNextToken: function () {
    if (this.featureToken()) {
      return;
    }
    
    if (this.scenarioToken()) {
      return;
    }
  },
  
  featureToken: function () {
    return this.gherkinToken('feature');
  },
  
  scenarioToken: function () {
    return this.gherkinToken('scenario');
  },
  
  scenarioOutlineToken: function () {
    return this.gherkinToken('scenario_outline');
  },
  
  backgroundToken: function () {
    return this.gherkinToken('background');
  },
  
  examplesToken: function () {
    
  },
  
  examplesRowToken: function () {
    
  },
  
  operatorToken: function () {
    var match;
    for (var j = 0; j < this.operators.length; j++) {
      match = this.gherkinToken(this.operators[j]);
      if (match) {
        return match;
      }
    }
    return false;
  },
  
  gherkinToken: function (name) {
    var match;
    if (this.match(this.keywords[name])[0] === '') {
      return false;
    }
    
    match = this.match(this.matchers[name]);
    this.line += helpers.count(match[0], "\n");
    for (var j = 1; j < match.length; j++) {
      this.i += match[j].length;
    }
    
    this.token(name.toUpperCase(), match[3]);
    return true;
  },
  
  lineToken: function () {
    var diff, indent, size;
    if (!(indent = this.match(MULTI_DENT, 1))) {
      return false;
    }
    
    this.line += helpers.count(indent, "\n");
    this.i += indent.length;
    size = indent.match(LAST_DENTS).reverse()[0].match(LAST_DENT)[1].length;
    
    if (size === this.indent) {
      return this.newlineToken(indent);
    } 
    else if (size > this.indent) {
      diff = size - this.indent + this.outdebt;
      this.token('INDENT', diff);
      this.indents.push(diff);
      this.outdebt = 0;
    } 
    else {
      this.outdentToken(this.indent - size);
    }
    
    this.indent = size;
    return true;
  },
  
  outdentToken: function(moveOut, close) {
    var dent, len;
    while (moveOut > 0) {
      len = this.indents.length - 1;
      if (this.indents[len] === undefined) {
        moveOut = 0;
      } 
      else if (this.indents[len] === this.outdebt) {
        moveOut -= this.outdebt;
        this.outdebt = 0;
      } 
      else if (this.indents[len] < this.outdebt) {
        this.outdebt -= this.indents[len];
        moveOut -= this.indents[len];
      } 
      else {
        dent = this.indents.pop();
        dent -= this.outdebt;
        moveOut -= dent;
        this.outdebt = 0;
        this.token('OUTDENT', dent);
      }
    }
    if (dent) {
      this.outdebt -= moveOut;
    }
    if (!(this.tag() === 'TERMINATOR')) {
      this.token('TERMINATOR', "\n");
    }
    return true;
  },
  
  token: function(tag, value) {
    return this.tokens.push([tag, value, this.line]);
  },
  
  prev: function(index) {
    return this.tokens[this.tokens.length - (index || 1)];
  },
  
  tag: function(index, newTag) {
    var tok;
    if (!(tok = this.prev(index))) {
      return null;
    }
    if (typeof newTag !== "undefined" && newTag !== null) {
      return (tok[0] = newTag);
    }
    return tok[0];
  },
  
  match: function(regex, index) {
    var m;
    if (!(m = this.chunk.match(regex))) {
      return false;
    }
    
    if (m) {
      return index ? m[index] : m;
    }
    else {
      return false;
    }
  }
};

exports.Lexer = Lexer;