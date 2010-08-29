/*
 * parser.js: Custom state machine based Parser for Kyuri
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var Parser = function () {
  
};

var states = {
  start: {
    transitions: {
      'FEATURE': {
        value: 'FEATURE',
        next: 'feature'
      }
    }
  },
  
  finish: {
    transitions: { /* EMPTY */ }
  },
  
  fail: {
    transitions: { /* EMPTY */ }
  },
  
  feature: {
    transitions: {
      'SENTENCE': {
        value: '*',
        next: 'featureHeader'
      }
    }
  },
  
  featureHeader: {
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'featureHeader',
        last: ['TERMINATOR', 'SENTENCE']
      },
      'SENTENCE': {
        value: '*',
        next: 'featureDescription',
        last: 'TERMINATOR'
      }
    }
  },
  
  featureDescription: {
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'featureDescription', 
        last: 'SENTENCE'
      },
      'SENTENCE': {
        value: '*',
        next: 'featureDescription',
        last: 'TERMINATOR'
      },
      'INDENT': {
        value: 1,
        next: 'featureDescription',
        last: 'TERMINATOR'
      }
      'SCENARIO': {
        value: 'SCENARIO',
        next: 'scenario',
        last: 'INDENT'
      },
    }
  },
  
  scenario: {
    transitions: {
      'SENTENCE': {
        value: '*',
        next: 'scenarioHeader',
        last: 'SCENARIO'
      }
    }
  }
};

Parser.prototype = {
  parse: function (tokens) {
    
  }
};

exports.Parser = Parser;