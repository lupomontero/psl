const Benchmark = require('benchmark');
const psl = require('../')

const suite = new Benchmark.Suite();
suite.add('psl#isValid', {
  fn: () => {
    psl.isValid('google.com');
  }
});
suite.add('psl#parse', {
  fn: () => {
    psl.parse('google.com');
  }
});
suite.add('psl#parse invalid domain', {
  fn: () => {
    psl.parse('google.comp');
  }
});
    
suite.on('cycle', (event) => {
  console.log(String(event.target));
});
suite.run();