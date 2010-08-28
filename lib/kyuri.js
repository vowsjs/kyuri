/*
 * kyuri.js: Top-level include for Kyuri.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var kyuri = exports;

kyuri.version = '0.0.1';
kyuri.compile = require('kyuri/core').compile;
kyuri.tokens  = require('kyuri/core').tokens;
kyuri.nodes   = require('kyuri/core').nodes;
