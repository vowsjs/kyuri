/*
 * core.js: Core parser runner for Kyuri. Basically:
 *   1. Get the jison parser
 *   2. Set our custom lexer
 *   3. That's gold Jerry! Gold! 
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var parser = require('./parser').parser,
    i8n = require('./i8n').i8n,
    Lexer = require('./lexer').Lexer;

var core = exports,
    lexer = new Lexer(i8n);

exports.compile = function (code, options) {
  options = options || {};
  try {
    return (parser.parse(lexer.tokenize(code))).compile(options);
  }
  catch (err) {
    if (options.fileName) {
      err.message = ("In " + (options.fileName) + ", " + (err.message));
    }
    throw err;
  }
};

exports.tokens = function (code) { 
  return lexer.tokenize(code);
};
  
exports.nodes = function (code) {
  return parser.parse(lexer.tokenize(code));
};

exports.i8n = i8n;

//
// Monkey slap the Jison parser since we're providing our own lexer.
//
parser.lexer = {
  lex: function() {
    var token;
    token = this.tokens[this.pos] || [""];
    this.pos += 1;
    this.yylineno = token[2];
    this.yytext = token[1];
    return token[0];
  },
  setInput: function(tokens) {
    this.tokens = tokens;
    return (this.pos = 0);
  },
  upcomingInput: function() {
    return "";
  }
};
