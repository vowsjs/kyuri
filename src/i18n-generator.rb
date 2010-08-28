#
# i18n-generator: Converts i18n.yml to i18n.json because js-yaml can't handle it. 
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
File.open('src/i18n.yml', 'r') do |infile|
  yaml_data = ''
  while (line = infile.gets)
    yaml_data += line
  end
  
  parsed = YAML::load(yaml_data)
  
  File.open('lib/kyuri/i18n.js', 'w') { |f| f.write("exports.i18n = #{parsed.to_json};") }
end