#
# i18n-generator: Generates i18n.json from the gherkin gem. 
#
# (C) 2010 Charlie Robbins
# MIT LICENSE
#

require 'rubygems'
require 'gherkin/i18n'
require 'json'

File.open('lib/kyuri/i18n.js', 'w') { |f| f.write("exports.i18n = #{JSON.pretty_generate(Gherkin::I18n::LANGUAGES)};") }
