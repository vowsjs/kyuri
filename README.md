

# kyuri - plain words go in, [VowsJS][3] stubs come out

<img src = "http://imgur.com/WwNkr.gif" border="0">

kyuri is a [node.js][1] [Cucumber][0] implementation with a few extra asynchronous keywords. it supports 160+ languages and exports to [VowsJS][3] stubs

## Example

A feature in kyuri might look like this...

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
  "Add two numbers": {
  	"GIVEN I have entered 50 into the calculator": {
		  topic: function () {
		    /* Setup your test conditions here */
		  },
			"AND I have entered 70 into the calculator": {
			  topic: function () {
			    /* Setup your test conditions here */
			  },
				"WHEN I press add": {
				  topic: function () {
				    /* Setup your test conditions here */
				  },
					"THEN the result should be 120 on the screen": function () {
					  /* Setup your test assertions here */
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

### Installing kyuri
<pre>
  npm install kyuri
</pre>

###VowsJS

[Vows][3]  is a popular [Behavior Driven Development][4] framework for node.js. Vows was built from the ground up to test asynchronous code. It executes your tests in parallel when it makes sense, and sequentially when there are dependencies.

Instead of crafting your VowsJS code from hand (using JavaScript), kyuri allows you to auto-generate Vows stubs. 

###Protip: 
kyuri is meant to be a low-level tool. if you want to compose Features and Scenarios using kyuri and a rich user-interface check out our other Node Knockout Entry, [prenup][2].


## Authors
### created by [Charlie Robbins][7] for Node Knockout 2010
### big ups to [Jeremy Ashkenas][5] for being a languages black-belt and making [coffee-script][6]

[0]: http://cukes.info "Cucumber"
[1]: http://nodejs.org "node.js"
[2]: http://github.com/nodejitsu/prenup "prenup"
[3]: http://vowsjs.org "VowsJs"
[4]: http://en.wikipedia.org/wiki/Behavior_Driven_Development "Behavior Driven Development"
[5]: http://github.com/jashkenas "Jeremy Ashkenas"
[6]: http://github.com/jashkenas/coffee-script "coffee-script"
[7]: http://github.com/indexzero "Charlie Robbins"
