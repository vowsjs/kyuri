
# Kyuri - plain words go in, [VowsJS][3] stubs come out

<img src = "http://imgur.com/crtzz.gif" border="0">

Kyuri is a [node.js][1] [Cucumber][0] implementation with a few extra asynchronous keywords. it supports 160+ languages and exports to [VowsJS][3] stubs

## Example

A feature in Kyuri might look like this...

<pre>Feature: Addition
  In order to avoid silly mistakes
  As a math idiot
  I want to be told the sum of two numbers

  Scenario: Add two numbers
    Given I have entered 50 into the calculator
    And I have entered 70 into the calculator
    When I press add
    Then the result should be 120 on the screen
</pre>

Should output:

<pre>
vows.describe('Addition').addBatch({
  "Given": {
    topic: function () {/* Do something async */},
    'I have entered 50 into the calculator': function (topic) {
      /* Test the result here */
    },
    "And": {
      topic: function () {/* Do something async */},
      'I have entered 50 into the calculator': function (topic) {
        /* Test the result here */
      },
      "When": {
        topic: function () {/* Do something async */},
        'I press add': function (topic) {
          /* Test the result here */
        },
        "Then": {
          topic: function () {/* Do something async */},
          'the result should be 120 on the screen': function (topic) {
            /* Test the result here */
          },
        }
      }
    }
  }      
}).export(module);
</pre>


## Installation

### Installing npm (node package manager)
<pre>
  curl http://npmjs.org/install.sh | sh
</pre>

### Installing nuptials
<pre>
  npm install kyuri
</pre>

###VowsJS

[Vows][3]  is a popular [Behavior Driven Development[4] framework for node.js. Vows was built from the ground up to test asynchronous code. It executes your tests in parallel when it makes sense, and sequentially when there are dependencies.

Instead of crafting your VowsJS code from hand (using JavaScript), Nuptials allows you to auto-generate Vows stubs. 

For further information about VowsJS, please visit it's repository here.

###Protip: 
Kyuri is meant to be a low-level tool. if you want to compose Features and Scenarios using Kyuri and a rich user-interface check out our other Node Knockout Entry, [Nuptials][2].


## Authors
### Created for Node Knockout 2010 by The NYC Nodejitsu Ninjas
#### almost entirely Charlie Robbins, he knows nodejitsu ^_^

[0]: http://cukes.info "Cucumber"
[1]: http://nodejs.org "node.js"
[2]: http://github.com/nodejitsu/nuptials "Nuptials"
[3]: http://vowsjs.org "VowsJs"
[4]: http://en.wikipedia.org/wiki/Behavior_Driven_Development "Behavior Driven Development"
