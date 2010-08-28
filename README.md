# Kyuri

a Gherkin dialect built specifically for asynchronous programming that targets javascript.

## Installation

## Example

A feature like so:

<pre>  
Feature: Addition
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

## Authors
#### Charlie Robbins



