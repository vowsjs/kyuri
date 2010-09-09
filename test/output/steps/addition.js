/*
 * Addition.feature
 * Step definitions for 'Addition'
 *
 * Auto-generated using Kyuri: http://github.com/nodejitsu/kyuri
 */
 
var kyuri = require('kyuri'),
    Steps = require('kyuri').Steps;
    
// Step definitions for Scenario: Add two numbers
Steps.GIVEN(/^GIVEN I have entered 50 into the calculator$/, function (topic) {
	  return function () {
	    // Always use or extend the same topic since you don't 
	    // know how nested or not nested you are at this point
	    topic = topic || {};
	    
	    /* Put your GIVEN code here. */
	    
	    return topic;
	  };
	});
	
	Steps.AND(/^AND I have entered 70 into the calculator$/, function (topic) {
	  return function () {
	    // Always use or extend the same topic since you don't 
	    // know how nested or not nested you are at this point
	    topic = topic || {};
	    
	    /* Put your AND code here. */
	    
	    return topic;
	  };
	});
	
	Steps.WHEN(/^WHEN I press add$/, function (topic) {
	  return function () {
	    // Always use or extend the same topic since you don't 
	    // know how nested or not nested you are at this point
	    topic = topic || {};
	    
	    /* Put your WHEN code here. */
	    
	    return topic;
	  };
	});
	
	Steps.THEN(/^THEN the result should be 120 on the screen$/, function (topic) {
	  return function () {
	    /* Put your assert messages for this THEN here */
	  };
	});

Steps.export(module);