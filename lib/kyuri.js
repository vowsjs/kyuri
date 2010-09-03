/*
 * kyuri.js: Top-level include for Kyuri.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(__dirname);

var kyuri = exports;

kyuri.version = '0.0.1';
kyuri.compile     = require('kyuri/core').compile;
kyuri.parse       = require('kyuri/core').parse;
kyuri.parseAST    = require('kyuri/core').parseAST;
kyuri.tokens      = require('kyuri/core').tokens;
kyuri.nodes       = require('kyuri/core').nodes;
kyuri.setLanguage = require('kyuri/core').setLanguage;
kyuri.i18n        = require('kyuri/core').i18n;
