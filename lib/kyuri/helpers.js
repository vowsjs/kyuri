/*
 * helpers.js: Helpers for the Kyuri parser / lexer.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var helpers = exports;

helpers.count = function(string, letter) {
  var num, pos;
  num = 0;
  pos = string.indexOf(letter);
  while (pos !== -1) {
    num += 1;
    pos = string.indexOf(letter, pos + 1);
  }
  
  return num;
};