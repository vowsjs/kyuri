/*
 * generator.js: Custom code generator that produces vows code from Kyuri AST.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var _ = require('underscore')._,
    fs = require('fs'),
    path = require('path'),
    eyes = require('eyes'),
    sys = require('sys');

// Configure underscore to work like mustache    
_.templateSettings = {
  start       : '{{',
  end         : '}}',
  interpolate : /\{\{(.+?)\}\}/g
};

var load = function (files, templateDir) {
  var templates = {};
  for (var name in files) {
    var templatePath = path.join(__dirname, templateDir, files[name]);
    templates[name] = fs.readFileSync(templatePath).toString();
  }
  
  return templates;
}

var Generator = function (ast) {
  this.ast = ast;
  this.templateDir = 'templates/vows';
  this.doIndent = true;
  this.files = {
    'step': 'step.tmpl', 
    'topic': 'topic.tmpl',
    'scenario': 'scenario.tmpl',
    'feature': 'feature.tmpl'
  };
  
  this.templates = load(this.files, this.templateDir);
};

Generator.prototype = {
  compile: function (options) {
    var features = [];
    
    this.indents = ['', ''];
    this.vows = '';
    for (var index in this.ast) {
      features.push(this.renderFeature(this.ast[index]));
    }
    
    if (options.directory) {
      for (var i = 0; i < features.length; i++) {
        var filename = features[i].name.split(' ').join('-').toLowerCase() + '.js';
        fs.writeFileSync(path.join(options.directory, filename), features[i].text);
      }
    }
    
    return features;
  },
  
  renderFeature: function (feature) {
    var context = {
      title: feature.name,
      scenarios: ''
    }
    
    for (var i = 0; i < feature.scenarios.length; i++) {
      context.scenarios += this.renderScenario(feature.scenarios[i]);
    }
    
    template = _.template(this.templates['feature']);
    rendered = template(context);
    
    return {
      name: feature.name,
      text: rendered
    };
  },
  
  renderScenario: function (scenario) {
    var generateTopic = false, rendered, template;
    var context = {
      title: scenario.name,
      body: ''
    };
    
    for (var i = scenario.breakdown.length - 1; i >= 0 ; i--) {
      var step = scenario.breakdown[i];
      
      if (generateTopic) {
        context.body = this.renderTopic(step, context.body);
      }
      else {
        context.body += this.renderStep(step);
      }
      
      // Need to record when we've passed the 'Then' step because 
      // that is where we should stop generating topics and start
      // generating assertions
      if (this.isThen(step)) {
        generateTopic = true;
      }
    }
    
    context.body = this.indent(context.body, 1);
    
    template = _.template(this.templates['scenario']);
    rendered = template(context);
    return rendered;
  },
  
  renderTopic: function (step, next) {
    var rendered, template;
    step = step[Object.keys(step)[0]];
    
    template = _.template(this.templates['topic']);
    rendered = template({ 
      title: step.join(' '),
      operator: step[0],
      next: next
    }); 
    return this.doIndent ? this.indent(rendered) : rendered;
  },
  
  renderStep: function (step) {
    var rendered, template; 
    step = step[Object.keys(step)[0]];
    
    template = _.template(this.templates['step']);
    rendered = template({ 
      title: step.join(' '),
      operator: step[0] 
    });
    
    return this.doIndent ? this.indent(rendered) : rendered;
  },
  
  indent: function (text, start) {
    var lines = text.split('\n');
    start = start || 0; 
    for (var i = start; i < lines.length; i++) {
      lines[i] = this.indents.join('\t') + lines[i]; 
    }
    
    return lines.join('\n');
  },
  
  isThen: function (step) {
    return step[Object.keys(step)[0]][0].toUpperCase() === 'THEN';
  }
};

//
// Remark: We should have this setup to handle coffee script
//
var StepGenerator = function (ast) {
  Generator.call(this);
  
  this.ast = ast;
  this.templateDir = 'templates/steps';
  this.doIndent = false;
  this.files = {
    'step': 'step.js.tmpl', 
    'topic': 'topic.js.tmpl',
    'scenario': 'scenario.js.tmpl',
    'feature': 'feature.js.tmpl'
  };
  
  this.templates = load(this.files, this.templateDir);
};

// Make 'StepGenerator' inherit from 'Generator' 
sys.inherits(StepGenerator, Generator);

exports.Generator = Generator;
exports.StepGenerator = StepGenerator;