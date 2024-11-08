import assert from 'assert';
import psl from '../index.js';

describe('psl.parse()', () => {
  it('should throw when no domain passed', () => {
    assert.throws(() => {
      psl.parse();
    }, /Domain name must be a string/i);
  });

  it('should return obj with error when domain too short', () => {
    var parsed = psl.parse('');
    assert.equal(parsed.input, '');
    assert.ok(/too short/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'DOMAIN_TOO_SHORT');
  });

  it('should return obj with error when domain too long', () => {
    var str = '';
    while (str.length < 256) {
      str += 'x';
    }
    assert.equal(str.length, 256);
    var parsed = psl.parse(str);
    assert.equal(parsed.input, str);
    assert.ok(/too long/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'DOMAIN_TOO_LONG');
  });

  it('should return obj with error when label too short', () => {
    var parsed = psl.parse('a..com');
    assert.equal(parsed.input, 'a..com');
    assert.ok(/at least 1 char/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_TOO_SHORT');
  });

  it('should return obj with error when label too long', () => {
    var str = '';
    while (str.length < 64) {
      str += 'x';
    }
    assert.equal(str.length, 64);
    var parsed = psl.parse(str + '.com');
    assert.equal(parsed.input, str + '.com');
    assert.ok(/long/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_TOO_LONG');
  });

  it('should return obj with error when domain starts with a dash', () => {
    var parsed = psl.parse('-foo');
    assert.equal(parsed.input, '-foo');
    assert.ok(/start with a dash/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
  });

  it('should throw when label starts with a dash', () => {
    var parsed = psl.parse('aa.-foo.com');
    assert.equal(parsed.input, 'aa.-foo.com');
    assert.ok(/start with a dash/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_STARTS_WITH_DASH');
  });

  it('should throw when domain ends with a dash', () => {
    var parsed = psl.parse('foo-');
    assert.equal(parsed.input, 'foo-');
    assert.ok(/end with a dash/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
  });

  it('should throw when label ends with a dash', () => {
    var parsed = psl.parse('foo-.net');
    assert.equal(parsed.input, 'foo-.net');
    assert.ok(/end with a dash/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_ENDS_WITH_DASH');
  });

  it('should throw when domain has invalid chars', () => {
    var parsed = psl.parse('foo-^%&!*&^.com');
    assert.equal(parsed.input, 'foo-^%&!*&^.com');
    assert.ok(/alphanum/i.test(parsed.error.message));
    assert.equal(parsed.error.code, 'LABEL_INVALID_CHARS');
  });

  it('should parse not-listed punycode domain', () => {
    var parsed = psl.parse('xn----dqo34k.xn----dqo34k');
    assert.equal(parsed.tld, 'xn----dqo34k');
    assert.equal(parsed.sld, 'xn----dqo34k');
    assert.equal(parsed.domain, 'xn----dqo34k.xn----dqo34k');
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, false);
  });

  it('should parse a blogspot.co.uk domain', () => {
    var parsed = psl.parse('foo.blogspot.co.uk');
    assert.equal(parsed.tld, 'blogspot.co.uk');
    assert.equal(parsed.sld, 'foo');
    assert.equal(parsed.domain, 'foo.blogspot.co.uk');
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, true);
  });

  it('should parse domain without subdomains', () => {
    var parsed = psl.parse('google.com');
    assert.equal(parsed.tld, 'com');
    assert.equal(parsed.sld, 'google');
    assert.equal(parsed.domain, 'google.com');
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, true);
  });

  it('should parse domain with subdomains', () => {
    var parsed = psl.parse('www.google.com');
    assert.equal(parsed.tld, 'com');
    assert.equal(parsed.sld, 'google');
    assert.equal(parsed.domain, 'google.com');
    assert.equal(parsed.subdomain, 'www');
    assert.equal(parsed.listed, true);
  });

  it('should parse FQDN', () => {
    var parsed = psl.parse('www.google.com.');
    assert.equal(parsed.tld, 'com');
    assert.equal(parsed.sld, 'google');
    assert.equal(parsed.domain, 'google.com');
    assert.equal(parsed.subdomain, 'www');
    assert.equal(parsed.listed, true);
  });

  it('should parse a.b.c.d.foo.com', () => {
    var parsed = psl.parse('a.b.c.d.foo.com');
    assert.equal(parsed.tld, 'com');
    assert.equal(parsed.sld, 'foo');
    assert.equal(parsed.domain, 'foo.com');
    assert.equal(parsed.subdomain, 'a.b.c.d');
    assert.equal(parsed.listed, true);
  });

  it('should parse data.gov.uk', () => {
    var parsed = psl.parse('data.gov.uk');
    assert.equal(parsed.tld, 'gov.uk');
    assert.equal(parsed.sld, 'data');
    assert.equal(parsed.domain, 'data.gov.uk');
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, true);
  });

  it('should parse gov.uk', () => {
    var parsed = psl.parse('gov.uk');
    assert.equal(parsed.tld, 'gov.uk');
    assert.equal(parsed.sld, null);
    assert.equal(parsed.domain, null);
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, true);
  });

  it('should parse github.io', () => {
    var parsed = psl.parse('github.io');
    assert.equal(parsed.tld, 'github.io');
    assert.equal(parsed.sld, null);
    assert.equal(parsed.domain, null);
    assert.equal(parsed.subdomain, null);
    assert.equal(parsed.listed, true);
  });
});
