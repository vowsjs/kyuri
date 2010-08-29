/*
 * parser.js: Custom state machine based Parser for Kyuri
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var sys = require('sys'),
    eyes = require('eyes');

var Parser = function () {

};

var _states = {
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

  feature: {
    parent: 'start',
    transitions: {
      'SENTENCE': {
        value: '*',
        next: 'featureHeader'
      }
    }
  },

  featureHeader: {
    parent: 'feature',
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'featureHeader',
        last: ['TERMINATOR', 'SENTENCE']
      },
      'INDENT': {
        value: 1,
        next: 'featureDescription',
        last: 'TERMINATOR'
      }
    }
  },

  featureDescription: {
    parent: 'feature',
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'featureDescription',
        last: ['SENTENCE', 'TERMINATOR']
      },
      'SENTENCE': {
        value: '*',
        next: 'featureDescription',
        last: ['TERMINATOR', 'INDENT']
      },
      'SCENARIO': {
        value: 'SCENARIO',
        next: 'scenario',
        last: ['TERMINATOR', 'OUTDENT']
      },
      'SCENARIO_OUTLINE': {
        value: 'SCENARIO_OUTLINE',
        next: 'scenario',
        last: ['TERMINATOR', 'OUTDENT']
      }
    }
  },

  scenario: {
    parent: 'feature',
    transitions: {
      'SENTENCE': {
        value: '*',
        next: 'scenarioHeader',
        last: ['SCENARIO', 'SCENARIO_OUTLINE']
      }
    }
  },

  scenarioHeader: {
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'scenarioHeader',
        last: 'SENTENCE'
      },
      'INDENT': {
        value: '*',
        next: 'stepOperator',
        last: 'TERMINATOR'
      }
    }
  },

  stepOperator: {
    transitions: {
      'OPERATOR': {
        value: '*',
        next: 'stepBody',
        last: ['INDENT', 'TERMINATOR']
      },
      'EXAMPLES': {
        value: 'EXAMPLES',
        next: 'examples',
        last: 'TERMINATOR'
      },
      'OUTDENT': {
        value: 1,
        next: 'featureDescription',
        last: 'TERMINATOR'
      },
      'EOF': {
        value: 'EOF',
        next: 'finish',
        last: 'TERMINATOR'
      }
    }
  },

  stepBody: {
    transitions: {
      'SENTENCE': {
        value: '*',
        next: 'stepBody',
        last: 'OPERATOR'
      },
      'TERMINATOR': {
        value: '*',
        next: 'stepOperator',
        last: 'SENTENCE'
      },
      'EOF': {
        value: 'EOF',
        next: 'finish',
        last: 'SENTENCE'
      }
    }
  },

  examples: {
    transitions: {
      'TERMINATOR': {
        value: '*',
        next: 'examples',
        last: ['TERMINATOR', 'EXAMPLES']
      },
      'INDENT': {
        value: 1,
        next: 'exampleRows',
        last: 'TERMINATOR'
      }
    }
  },

  exampleRows: {
    transitions: {
      'EXAMPLE_ROW': {
        value: '*',
        next: 'exampleRows',
        last: ['INDENT', 'TERMINATOR']
      },
      'TERMINATOR': {
        value: '*',
        next: 'exampleRows',
        last: 'EXAMPLE_ROW'
      },
      'OUTDENT': {
        value: 2,
        next: 'featureDescription',
        last: 'TERMINATOR'
      },
      'EOF': {
        value: 'EOF',
        next: 'finish',
        last: 'TERMINATOR'
      }
    }
  }
};

Parser.prototype = {
  parse: function (tokens) {
    this.tokens = tokens;
    this.states = Object.create(_states);
    this.current = this.states['start'];
    this.last = null;

    while (this.tokens.length > 0) {
      var token = this.tokens.shift();
      //eyes.inspect(token);
      this.checkToken(token);
      this.last = token;
    }
  },

  checkToken: function (token) {
    var next = Object.keys(this.current.transitions);
    if (next.indexOf(token[0]) !== -1) {
      this.checkTransition(token, this.current.transitions[token[0]]);
    }
    else {
      throw new Error('Unexpected token "' + token[0] + '" at line ' + token[2]);
    }
  },

  checkTransition: function (token, transition) {
    if ((transition.value === '*' || transition.value === token[1])
      && this.checkLast(transition)) {
      // If the transition value matches the current token and the last token
      // was expected in our state machine, enter that state
      this.current = this.states[transition.next];
      //sys.puts('Transition to: ' + transition.next);
    }
    else {
      throw new Error('Unexpected value "' + token[1] + '" for token "' + token[0] + '" at line ' + token[2]);
    }
  },

  checkLast: function (transition) {
    if (typeof transition.last === 'undefined'
      || (typeof transition.last === 'string' && transition.last === this.last[0])) {
      return true;
    }
    else if (transition.last instanceof Array
      && transition.last.indexOf(this.last[0]) !== -1) {
      return true;
    }

    throw new Error('Mismatched last token "' + this.last[0] + '" at line ' + this.last[2]);
  }
};

exports.Parser = Parser;
