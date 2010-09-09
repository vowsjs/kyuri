/*
 * kyuri.js: Top-level include for Kyuri.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(__dirname);

var kyuri = exports;

//
// Export core methods
//
kyuri.version = '0.1.0';
kyuri.compile     = require('kyuri/core').compile;
kyuri.parse       = require('kyuri/core').parse;
kyuri.tokens      = require('kyuri/core').tokens;
kyuri.nodes       = require('kyuri/core').nodes;
kyuri.setLanguage = require('kyuri/core').setLanguage;
kyuri.i18n        = require('kyuri/core').i18n;
kyuri.Steps       = require('kyuri/steps');

//
// Export runners
// 
kyuri.runners = {};
kyuri.runners.vows = require('kyuri/runners/vows');

//
// Remark we should probably export the runner methods
// on the global Kyuri object. 
//

// Set default runner to vows
kyuri.runner = kyuri.runners.vows;