Feature: Addition     #AND A COMMENT!!!
	In order to avoid silly mistakes
	As a math idiot
	I want to be told the sum of two numbers
	
	@tag1 @tag2
#AND A COMMENT!!!
	Scenario: Add two numbers
		"""
		Hey I'm a pystring, check me out now
		Multi-line too!
		"""
		Given I have entered 50 into the calculator
		And I have entered 70 into the calculator
		When I press add
		Then the result should be 120 on the screen