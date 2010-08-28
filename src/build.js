/*
 * build.js: Build script for converting i8n.yml to json then building the grammar.js file
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var fs = require('fs'),
    jison = require('jison');

/*// Execute our little Ruby script to convert YAML to JSON
// since js-yaml can't handle i8n.yml
var yamlJson = spawn('ruby', ['src/i8n-generator.rb']);

yamlJson.on('exit', function (code) {
  fs.readFile('src/i8n.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    
    var dirtyJson = data.toString();
    fs.writeFile('src/i8n.json', JSON.stringify(dirtyJson), 'utf8', function (err) {
      
    });
  });
});*/

var grammarPath = 'src/grammar.js';
var parserPath = 'lib/kyuri/parser.js';

debug('Reading grammar file located at: ' + grammarPath);
fs.readFile(grammarPath, function (err, data) {
  if (err) {
    throw err;
  }
  
  var parserSource = new (jison.Parser)(JSON.parse(data.toString));
  fs.writeFile(parserPath, parserSource, function (err) {
    if (err) {
      throw err;
    }
    
    debug('Parser successfully written to: ' + parserPath);
  });
});