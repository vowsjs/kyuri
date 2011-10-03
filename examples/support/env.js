/*
 * Set up environmental configuration here, for example database events and functions
 *
 * (C) 2011 Paul Covell (paul@done.com)
 * MIT LICENSE
 *
 */
var Runner = require('kyuri').runner;

Runner.on('beforeTest', function (done) {
  console.log('beforeTest event');
  done();
});

Runner.on('afterTest', function (done) {
  console.log('afterTest event');
  done();
});