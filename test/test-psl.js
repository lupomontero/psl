//
// Deps
//

var test = require('tape');


//
// The plugin module we will be tesing
//

var psl = require('../');


//
// Tests
//

test('psl should be an object with parse and isValid methods', function (t) {
  t.plan(2);
  t.equal(typeof psl.parse, 'function');
  t.equal(typeof psl.isValid, 'function');
});

test('psl.parse should parse domain without subdomains', function (t) {
  var parsed = psl.parse('google.com');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.trd, null);
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, null);
});

/*
it('psl.parse should parse domain with subdomains', function (done) {
  var parsed = psl.parse('www.google.com');
  expect(parsed.tld).to.equal('com');
  expect(parsed.sld).to.equal('google');
  expect(parsed.trd).to.equal('www');
  expect(parsed.domain).to.equal('google.com');
  expect(parsed.subdomain).to.equal('www.google.com');
  done();
});

it('psl.parse should parse FQDN', function (done) {
  var parsed = psl.parse('www.google.com.');
  expect(parsed.tld).to.equal('com');
  expect(parsed.sld).to.equal('google');
  expect(parsed.trd).to.equal('www');
  expect(parsed.domain).to.equal('google.com');
  expect(parsed.subdomain).to.equal('www.google.com');
  done();
});
*/

/*
describe('psl.isValid', function () {

  [
    { value: 'google.com', expected: true },
    { value: 'www.google.com', expected: true },
    { value: 'x.yz', expected: false }
  ].forEach(function (item) {

    it('should return ' + item.expected + ' for ' + item.value, function (done) {
      expect(psl.isValid(item.value)).to.equal(item.expected);
      done();
    });

  });

});

describe('psl.get (based on Mozilla\'s test data)', function () {

  require('./mozilla-data').forEach(function (item) {

    it('should return ' + item.expected + ' for ' + item.value, function (done) {
      expect(psl.get(item.value)).to.equal(item.expected);
      done();
    });

  });

});
*/

