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
    Generator = require('./generator').Generator,
    StepGenerator = require('./generator').StepGenerator;

var core = exports,
    parser = new Parser(),
    lexer = new Lexer('en', i18n);

exports.compile = function (code, options) {
  var isText = typeof code === 'string', ast;
  
  // Default options are to generate steps only
  options = options || {};
  options.target = options.target || 'steps'
  options.tabspace = options.tabspace || 8;

  try {
    if (isText) {
      // Convert groups of spaces to tabs
      code = code.replace(new RegExp(' {' + options.tabspace + '}', 'g'), '\t');
      // we don't need this anymore
      delete options.tabspace;
      
      ast = parser.parse(lexer.tokenize(code));
    } else {
      ast = code;
    }
    
    var steps = new StepGenerator(ast).compile(options);
    
    if (options.target === 'all') {
      var vows = new Generator(ast).compile(options);
      return {
        vows : vows,
        steps: steps 
      };
    }
    
    return { steps: steps };
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
