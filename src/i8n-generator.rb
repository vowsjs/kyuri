#
# i8n-generator: Converts i8n.yml to i8n.json because js-yaml can't handle it. 
#
# (C) 2010 Charlie Robbins
# MIT LICENSE
#

require 'rubygems'
require 'yaml'
require 'json'

File.open('src/i8n.yml', 'r') do |infile|
  yaml_data = ''
  while (line = infile.gets)
    yaml_data += line
  end
  
  parsed = YAML::load(yaml_data)
  
  File.open('lib/kyuri/i8n.json', 'w') { |f| f.write(parsed.to_json) }
end