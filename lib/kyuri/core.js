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

var Parser = require('./parser').Parser,
    Lexer = require('./lexer').Lexer,
    i18n = require('./i18n').i18n;

var core = exports,
    parser = new Parser(),
    lexer = new Lexer('en', i18n);

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

exports.i18n = i18n;

exports.lexer = lexer;
