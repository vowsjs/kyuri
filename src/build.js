/*
 * build.js: Build script for converting i18n.yml to json then building the grammar.js file
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var fs = require('fs'),
    sys = require('sys');

/*// Execute our little Ruby script to convert YAML to JSON
// since js-yaml can't handle i18n.yml
var yamlJson = spawn('ruby', ['src/i18n-generator.rb']);

yamlJson.on('exit', function (code) {
  fs.readFile('src/i18n.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    
    var dirtyJson = data.toString();
    fs.writeFile('src/i18n.json', JSON.stringify(dirtyJson), 'utf8', function (err) {
      
    });
  });
});*/

var grammarPath = 'src/grammar.js';
var parserPath = 'lib/kyuri/parser.js';

sys.puts('Reading grammar file located at: ' + grammarPath);
fs.readFile(grammarPath, function (err, data) {
  if (err) {
    throw err;
  }
  
  var parserSource = new (jison.Parser)(JSON.parse(data.toString));
  fs.writeFile(parserPath, parserSource, function (err) {
    if (err) {
      throw err;
    }
    
    sys.puts('Parser successfully written to: ' + parserPath);
  });
});