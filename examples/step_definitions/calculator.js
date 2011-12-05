var Steps = require('kyuri').Steps;

Steps.Given(/^I have entered (\d+) into the calculator$/, function (step, num) {
  console.log('Calculator: ' + num);
  step.done();
});

Steps.export(module);