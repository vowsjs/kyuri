Feature: Complex Addition
	In order to avoid silly mistakes
	As a math idiot
	I want to be told the sum of two numbers
	
	Scenario: Add two numbers
		Given I have entered 50 into the calculator
		And I have entered 70 into the calculator
		When I press add
		Then the result should be 120 on the screen

	Scenario Outline: Add three numbers
		Given I have entered <number1> into the calculator
		And I have entered <number2> into the calculator
		And I have entered 120 into the calculator
		When I press add
		Then the result should be <number3> on the screen
		
		Examples:
			| number1 | number2 | number3 |
			| 10      | 20      | 150     |
			| 20      | 40      | 180     |
			| 40      | 60      | 220     |
			
	Scenario: Add two numbers
		Given I have entered 50 into the calculator
		And I have entered 70 into the calculator
		When I press add
		Then the result should be 120 on the screen