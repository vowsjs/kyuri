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

var i18n = require('./i18n').i18n,
    Lexer = require('./lexer').Lexer,
    Parser = require('./parser').Parser,
    Generator = require('./generator').Generator;

var core = exports,
    parser = new Parser(),
    lexer = new Lexer('en', i18n);

exports.compile = function (code, options) {
  var isText = typeof code === 'string', generator;
  options = options || {};
  
  try {
    generator = isText ? parser.parse(lexer.tokenize(code)) : new (Generator)(code);
    return generator.compile(options);
  }
  catch (err) {
    if (options.fileName) {
      err.message = ("In " + (options.fileName) + ", " + (err.message));
    }
    throw err;
  }
};

exports.parse = function (code) {
  return parser.parse(lexer.tokenize(code));
};

exports.tokens = function (code) { 
  return lexer.tokenize(code);
};
  
exports.nodes = function (code) {
  return parser.parse(lexer.tokenize(code));
};

exports.setLanguage = function (language) {
  lexer = new Lexer(language, i18n);
};

exports.i18n = i18n;