/*
 * Grammar.target: Target file for building the grammar.js file from the keyword list in i18n.json 
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var jison = require('jison');

var grammar = {
  'comment': 'Adapated from the Ragel-based Gherkin parser',
  'author':  'Charlie Robbins',
  
  'tokens': 'FEATURE SCENARIO EXAMPLE EXAMPLE_ROW OPERATOR SENTENCE TERMINATOR INDENT OUTDENT'
};