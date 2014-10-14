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

test('psl.parse should throw when no domain passed', function (t) {
  var parsed = psl.parse();
  console.log(parsed);
  t.end();
});

test('psl.parse should parse not-listed punycode domain', function (t) {
  var parsed = psl.parse('xn----dqo34k.xn----dqo34k.com');
  console.log(parsed);
  t.end();
});

test('psl.parse should parse a blogspot.co.uk domain', function (t) {
  var parsed = psl.parse('foo.blogspot.co.uk');
  console.log(parsed);
  t.end();
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

test('psl.parse should parse domain with subdomains', function (t) {
  var parsed = psl.parse('www.google.com');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.trd, 'www');
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, 'www.google.com');
});

test('psl.parse should parse FQDN', function (t) {
  var parsed = psl.parse('www.google.com.');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.trd, 'www');
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, 'www.google.com');
});

[
  { value: 'google.com', expected: true },
  { value: 'www.google.com', expected: true },
  { value: 'x.yz', expected: false }
].forEach(function (item) {

  test('ps.isValid(' + item.value + ') should return ' + item.expected, function (t) {
    t.equal(psl.isValid(item.value), item.expected);
    t.end();
  });

});

require('./mozilla-data').forEach(function (item) {

  test('psl.get(' + item.value + ') should return ' + item.expected, function (t) {
    t.equal(psl.get(item.value), item.expected);
    t.end();
  });

});

