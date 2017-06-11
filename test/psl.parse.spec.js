/*eslint no-var:0, prefer-arrow-callback: 0 */
'use strict';


var Assert = require('assert');
var Psl = require('../');


describe('psl.parse()', function () {

  it('should throw when no domain passed', function () {

    Assert.throws(function () {

      Psl.parse();
    }, /Domain name must be a string/i);
  });

  it('should return obj with error when domain too short', function () {

    var parsed = Psl.parse('');
    Assert.equal(parsed.input, '');
    Assert.ok(/too short/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'DOMAIN_TOO_SHORT');
  });

  it('should return obj with error when domain too long', function () {

    var str = '';
    while (str.length < 256) {
      str += 'x';
    }
    Assert.equal(str.length, 256);
    var parsed = Psl.parse(str);
    Assert.equal(parsed.input, str);
    Assert.ok(/too long/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'DOMAIN_TOO_LONG');
  });

  it('should return obj with error when label too short', function () {

    var parsed = Psl.parse('a..com');
    Assert.equal(parsed.input, 'a..com');
    Assert.ok(/at least 1 char/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_TOO_SHORT');
  });

  it('should return obj with error when label too long', function () {

    var str = '';
    while (str.length < 64) {
      str += 'x';
    }
    Assert.equal(str.length, 64);
    var parsed = Psl.parse(str + '.com');
    Assert.equal(parsed.input, str + '.com');
    Assert.ok(/long/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_TOO_LONG');
  });

  it('should return obj with error when domain starts with a dash', function () {

    var parsed = Psl.parse('-foo');
    Assert.equal(parsed.input, '-foo');
    Assert.ok(/start with a dash/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
  });

  it('should throw when label starts with a dash', function () {

    var parsed = Psl.parse('aa.-foo.com');
    Assert.equal(parsed.input, 'aa.-foo.com');
    Assert.ok(/start with a dash/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
  });

  it('should throw when domain ends with a dash', function () {

    var parsed = Psl.parse('foo-');
    Assert.equal(parsed.input, 'foo-');
    Assert.ok(/end with a dash/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
  });

  it('should throw when label ends with a dash', function () {

    var parsed = Psl.parse('foo-.net');
    Assert.equal(parsed.input, 'foo-.net');
    Assert.ok(/end with a dash/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
  });

  it('should throw when domain has invalid chars', function () {

    var parsed = Psl.parse('foo-^%&!*&^.com');
    Assert.equal(parsed.input, 'foo-^%&!*&^.com');
    Assert.ok(/alphanum/i.test(parsed.error.message));
    Assert.equal(parsed.error.code, 'LABEL_INVALID_CHARS');
  });

  it('should parse not-listed punycode domain', function () {

    var parsed = Psl.parse('xn----dqo34k.xn----dqo34k');
    Assert.equal(parsed.tld, 'xn----dqo34k');
    Assert.equal(parsed.sld, 'xn----dqo34k');
    Assert.equal(parsed.domain, 'xn----dqo34k.xn----dqo34k');
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, false);
  });

  it('should parse a blogspot.co.uk domain', function () {

    var parsed = Psl.parse('foo.blogspot.co.uk');
    Assert.equal(parsed.tld, 'blogspot.co.uk');
    Assert.equal(parsed.sld, 'foo');
    Assert.equal(parsed.domain, 'foo.blogspot.co.uk');
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, true);
  });

  it('should parse domain without subdomains', function () {

    var parsed = Psl.parse('google.com');
    Assert.equal(parsed.tld, 'com');
    Assert.equal(parsed.sld, 'google');
    Assert.equal(parsed.domain, 'google.com');
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, true);
  });

  it('should parse domain with subdomains', function () {

    var parsed = Psl.parse('www.google.com');
    Assert.equal(parsed.tld, 'com');
    Assert.equal(parsed.sld, 'google');
    Assert.equal(parsed.domain, 'google.com');
    Assert.equal(parsed.subdomain, 'www');
    Assert.equal(parsed.listed, true);
  });

  it('should parse FQDN', function () {

    var parsed = Psl.parse('www.google.com.');
    Assert.equal(parsed.tld, 'com');
    Assert.equal(parsed.sld, 'google');
    Assert.equal(parsed.domain, 'google.com');
    Assert.equal(parsed.subdomain, 'www');
    Assert.equal(parsed.listed, true);
  });

  it('should parse a.b.c.d.foo.com', function () {

    var parsed = Psl.parse('a.b.c.d.foo.com');
    Assert.equal(parsed.tld, 'com');
    Assert.equal(parsed.sld, 'foo');
    Assert.equal(parsed.domain, 'foo.com');
    Assert.equal(parsed.subdomain, 'a.b.c.d');
    Assert.equal(parsed.listed, true);
  });

  it('should parse data.gov.uk', function () {

    var parsed = Psl.parse('data.gov.uk');
    Assert.equal(parsed.tld, 'gov.uk');
    Assert.equal(parsed.sld, 'data');
    Assert.equal(parsed.domain, 'data.gov.uk');
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, true);
  });

  it('should parse gov.uk', function () {

    var parsed = Psl.parse('gov.uk');
    Assert.equal(parsed.tld, 'gov.uk');
    Assert.equal(parsed.sld, null);
    Assert.equal(parsed.domain, null);
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, true);
  });

  it('should parse github.io', function () {

    var parsed = Psl.parse('github.io');
    Assert.equal(parsed.tld, 'github.io');
    Assert.equal(parsed.sld, null);
    Assert.equal(parsed.domain, null);
    Assert.equal(parsed.subdomain, null);
    Assert.equal(parsed.listed, true);
  });

});
