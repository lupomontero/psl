var test = require('tape');
var psl = require('../');

//
// Tests
//

test('psl should be an obj with parse, get and isValid methods', function (t) {
  t.plan(3);
  t.equal(typeof psl.parse, 'function');
  t.equal(typeof psl.get, 'function');
  t.equal(typeof psl.isValid, 'function');
});

test('psl.parse should throw when no domain passed', function (t) {
  t.plan(1);
  t.throws(function () { psl.parse(); }, /Domain name must be a string/i);
});

test('psl.parse should return obj with error when domain too short', function (t) {
  var parsed = psl.parse('');
  t.plan(3);
  t.equal(parsed.input, '');
  t.ok(/too short/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'DOMAIN_TOO_SHORT');
});

test('psl.parse should return obj with error when domain too long', function (t) {
  var str = '';
  while (str.length < 256) { str += 'x'; }
  t.plan(4);
  t.equal(str.length, 256);
  var parsed = psl.parse(str);
  t.equal(parsed.input, str);
  t.ok(/too long/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'DOMAIN_TOO_LONG');
});

test('psl.parse should return obj with error when label too short', function (t) {
  var parsed = psl.parse('a..com');
  t.plan(3);
  t.equal(parsed.input, 'a..com');
  t.ok(/at least 1 char/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_TOO_SHORT');
});

test('psl.parse should return obj with error when label too long', function (t) {
  var str = '';
  while (str.length < 64) { str += 'x'; }
  t.plan(4);
  t.equal(str.length, 64);
  var parsed = psl.parse(str + '.com');
  t.equal(parsed.input, str + '.com');
  t.ok(/long/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_TOO_LONG');
});

test('psl.parse should return obj with error when domain starts with a dash', function (t) {
  var parsed = psl.parse('-foo');
  t.plan(3);
  t.equal(parsed.input, '-foo');
  t.ok(/start with a dash/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
});

test('psl.parse should throw when label starts with a dash', function (t) {
  var parsed = psl.parse('aa.-foo.com');
  t.plan(3);
  t.equal(parsed.input, 'aa.-foo.com');
  t.ok(/start with a dash/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
});

test('psl.parse should throw when domain ends with a dash', function (t) {
  var parsed = psl.parse('foo-');
  t.plan(3);
  t.equal(parsed.input, 'foo-');
  t.ok(/end with a dash/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
});

test('psl.parse should throw when label ends with a dash', function (t) {
  var parsed = psl.parse('foo-.net');
  t.plan(3);
  t.equal(parsed.input, 'foo-.net');
  t.ok(/end with a dash/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
});

test('psl.parse should throw when domain has invalid chars', function (t) {
  var parsed = psl.parse('foo-^%&!*&^.com');
  t.plan(3);
  t.equal(parsed.input, 'foo-^%&!*&^.com');
  t.ok(/alphanum/i.test(parsed.error.message));
  t.equal(parsed.error.code, 'LABEL_INVALID_CHARS');
});

test('psl.parse should parse not-listed punycode domain', function (t) {
  var parsed = psl.parse('xn----dqo34k.xn----dqo34k');
  t.plan(5);
  t.equal(parsed.tld, 'xn----dqo34k');
  t.equal(parsed.sld, 'xn----dqo34k');
  t.equal(parsed.domain, 'xn----dqo34k.xn----dqo34k');
  t.equal(parsed.subdomain, null);
  t.equal(parsed.listed, false);
});

test('psl.parse should parse a blogspot.co.uk domain', function (t) {
  var parsed = psl.parse('foo.blogspot.co.uk');
  t.plan(5);
  t.equal(parsed.tld, 'blogspot.co.uk');
  t.equal(parsed.sld, 'foo');
  t.equal(parsed.domain, 'foo.blogspot.co.uk');
  t.equal(parsed.subdomain, null);
  t.equal(parsed.listed, true);
});

test('psl.parse should parse domain without subdomains', function (t) {
  var parsed = psl.parse('google.com');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, null);
  t.equal(parsed.listed, true);
});

test('psl.parse should parse domain with subdomains', function (t) {
  var parsed = psl.parse('www.google.com');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, 'www');
  t.equal(parsed.listed, true);
});

test('psl.parse should parse FQDN', function (t) {
  var parsed = psl.parse('www.google.com.');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'google');
  t.equal(parsed.domain, 'google.com');
  t.equal(parsed.subdomain, 'www');
  t.equal(parsed.listed, true);
});

test('psl.parse should parse a.b.c.d.foo.com', function (t) {
  var parsed = psl.parse('a.b.c.d.foo.com');
  t.plan(5);
  t.equal(parsed.tld, 'com');
  t.equal(parsed.sld, 'foo');
  t.equal(parsed.domain, 'foo.com');
  t.equal(parsed.subdomain, 'a.b.c.d');
  t.equal(parsed.listed, true);
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

