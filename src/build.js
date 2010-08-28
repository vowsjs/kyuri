/*
 * build.js: Build script for converting i8n.yml to json then building the grammar.js file
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var spawn = require('child_process').spawn,
    fs = require('fs');

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

