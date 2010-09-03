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

var MULTI_DENT        = /^(\t+)(\.)?/,
    IS_EXAMPLE_ROW    = /^([\|\s+\S+]+\s+\|\s*)$/,
    PARSE_EXAMPLE_ROW = /\|\s*(\S+)/gi,
    PYSTRING          = /"""/,
    TAGS_LENGTH       = /[@\w+\s*]+/i,
    TAGS              = /@(\w+)/gi,
    COMMENT           = /#\s*([\S+\s+]+)/i,
    SENTENCE          = /([\S+\s+]+)/i,
    SENTENCE_COMMENT  = /([\S+\s+]+)#\s*([\S+\s+]+)/i;

var Lexer = function (language, i18n) {
  // Set the i18n dictionary on the lexer for later use
  this.i18n = i18n;
  
  // Set the keyword type list on the lexer for later use
  this.operators = ['but', 'and', 'when', 'then', 'given'];
  this.headers = ['examples', 'background', 'feature', 'scenario_outline', 'scenario'];
  this.tokens = this.operators.concat(this.headers);
    
  // Initialize the set of keywords in the lexer
  this.keywords = {};
  for (var i = 0; i < this.tokens.length; i++) {
    this.keywords[this.tokens[i]] = [];
  }

  if (typeof i18n[language] === 'undefined') {
    throw new Error('Cannot lex against unknown language: ' + language);
  }
    
  // Build up the set of keywords from each language
  for (var key in i18n[language]) {
    if (typeof this.keywords[key] !== 'undefined') {
      this.keywords[key].unshift(i18n[language][key].replace(/^\*/, '').replace(/^\|/, ''));
    }
  }
  
  // Build up the set of regular expressions for matching
  // the entire set of i18n keyword tokens.
  this.matchers = {};
  for (var index in this.headers) {
    var key = this.headers[index];
    var base = '^(' + this.keywords[key].join('|') + ')(\\:\\s*)';
    this.matchers[key] = new RegExp(base, 'i');
  }
  
  for (var index in this.operators) {
    var key = this.operators[index];
    var base = '^(' + this.keywords[key].join('|') + ')';
    this.matchers[key] = new RegExp(base, 'i');
  }
};

Lexer.prototype = {
  tokenize: function (source, options) {
    if (!source) {
      throw new Error('Cannot lex null or undefined.');
    }
    
    source = source.replace(/(\r|\s+$)/g, '');
    this.options = options || {};          // Options passed to the lexer
    this.source = source;                  // Source code we are attempting to lex
    this.lineNum = 0;                      // Line number of the lexing operation
    this.indents = 0;                      // Number of indents
    this.tokens = [];                      // Stream of parsed tokens in the form ['TYPE', value, line]
    this.lines = this.source.split('\n');  // Split the source code by \n since we have no multi-line statements
    
    while (this.lines.length > 0) {
      this.i = 0;                          // Current character position in this line
      this.line = this.lines.shift();      // Get the next line
      
      while (this.i < this.line.length) {
        this.chunk = this.line.slice(this.i);
        this.extractNextToken();
      }
      
      this.newlineToken();
      this.lineNum++;
    }
    
    this.token('EOF', 'EOF');
    return this.tokens;
  },
  
  extractNextToken: function () {
    var tokens = ['lineToken', 'featureToken', 'scenarioToken', 'scenarioOutlineToken', 
    'backgroundToken', 'commentToken', 'examplesToken', 'examplesRowToken', 'operatorToken', 
    'pystringToken', 'tagToken', 'sentenceToken'];
    
    for (var index in tokens) {
      if (this[tokens[index]].apply(this)) {
        return;
      }
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
    return this.gherkinToken('examples');
  },
  
  examplesRowToken: function () {
    var match;
    if (!(match = this.match(IS_EXAMPLE_ROW, 1))) {
      return false;
    }
    
    this.i += match.length;
    var matches = this.match(PARSE_EXAMPLE_ROW);
    this.token('EXAMPLE_ROW', matches.map(function (item) { return item.replace('|','').trim() }));
    
    return true;
  },
  
  operatorToken: function () {
    var match;
    for (var j = 0; j < this.operators.length; j++) {
      match = this.gherkinToken(this.operators[j], 'operator');
      if (match) {
        return match;
      }
    }
    return false;
  },
  
  gherkinToken: function (name, type) {
    var match;
    if (!(match = this.match(this.matchers[name]))) {
      return false;
    }
    
    for (var j = 1; j < match.length; j++) {
      this.i += match[j].length;
    }
    
    if (type) {
      this.token(type.toUpperCase(), name.toUpperCase());
    }
    else {
      this.token(name.toUpperCase(), name.toUpperCase());
    }
    
    return true;
  },
  
  pystringToken: function () { 
    var match;
    if (!(match = this.match(PYSTRING))) {
      return false;
    }
    
    this.i += match[0].length;
    this.token('PYSTRING', 'PYSTRING');
    return true;
  },
  
  tagToken: function () {
    var match;
    if (!(match = this.match(TAGS))) {
      return false;
    }
    
    for (var j = 0; j < match.length; j++) {
      this.token('TAG', match[j].trim().replace('@',''));
    }
    
    match = this.match(TAGS_LENGTH);
    this.i += match[0].length;
    return true;
  },
  
  commentToken: function () {
    var match;
    if (!(match = this.match(COMMENT))) {
      return false;
    }
    
    // If the comment is at the beginning of the chunk
    // then evaluate it normally
    if(this.chunk.indexOf('#') === 0) { 
      this.i += match[0].length;
      this.token('COMMENT', match[1].trim());
      return true;
    }
    
    // Otherwise we have a comment inside of 
    // a SENTENCE token, so strip off the SENTENCE
    // and create tokens for both.
    match = this.match(SENTENCE_COMMENT); 
    this.i += match[0].length;
    this.token('SENTENCE', match[1].trim());
    this.token('COMMENT', match[2].trim());
    
    return true;
  },
  
  sentenceToken: function () {
    var sentence;
    if (!(sentence = this.match(SENTENCE, 1))) {
      return false;
    }
    
    this.i += sentence.length;
    this.token('SENTENCE', sentence.trim());
    
    return true;
  },
  
  lineToken: function () {
    var diff, indent, size;
    if (!(indent = this.match(MULTI_DENT, 1))) {
      return false;
    }
    
    size = indent.length;
    this.i += size;
    
    if (size > this.indents) {
      diff = size - this.indents;
      this.token('INDENT', diff);
    } 
    else if (size < this.indents) {
      this.token('OUTDENT', this.indents - size);
    }
    
    this.indents = size;
    return true;
  },
  
  newlineToken: function(newlines) {
    if (this.tag() !== 'TERMINATOR') {
      this.token('TERMINATOR', "\n");
    }
    return true;
  },
  
  token: function(tag, value) {
    var token = [tag, value, this.lineNum];
    return this.tokens.push(token);
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