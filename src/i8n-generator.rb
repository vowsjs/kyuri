#
# i8n-generator: Converts i8n.yml to i8n.json because js-yaml can't handle it. 
#
# (C) 2010 Charlie Robbins
# MIT LICENSE
#

require 'rubygems'
require 'yaml'
require 'json'

#
# Remark: This file doesn't print pretty JSON. 
#         Too many dependencies to make that work.
#
File.open('src/i8n.yml', 'r') do |infile|
  yaml_data = ''
  while (line = infile.gets)
    yaml_data += line
  end
  
  parsed = YAML::load(yaml_data)
  
  File.open('lib/kyuri/i8n.js', 'w') { |f| f.write("exports.i8n = #{parsed.to_json};") }
end