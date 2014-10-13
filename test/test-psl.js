//
// Deps
//

var Lab = require('lab');


//
// Test shortcuts
//

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;


//
// The plugin module we will be tesing
//

var psl = require('../');


//
// Tests
//

describe('psl', function () {

  it('should be an object with parse and isValid methods', function (done) {
    expect(typeof psl.parse).to.equal('function');
    expect(typeof psl.isValid).to.equal('function');
    done();
  });

  describe('psl.parse', function () {
  
    it('should parse domain without subdomains', function (done) {
      var parsed = psl.parse('google.com');
      expect(parsed.tld).to.equal('com');
      expect(parsed.sld).to.equal('google');
      expect(parsed.trd).to.equal(null);
      expect(parsed.domain).to.equal('google.com');
      expect(parsed.subdomain).to.equal(null);
      done();
    });

    it('should parse domain with subdomains', function (done) {
      var parsed = psl.parse('www.google.com');
      expect(parsed.tld).to.equal('com');
      expect(parsed.sld).to.equal('google');
      expect(parsed.trd).to.equal('www');
      expect(parsed.domain).to.equal('google.com');
      expect(parsed.subdomain).to.equal('www.google.com');
      done();
    });

    it('should parse FQDN', function (done) {
      var parsed = psl.parse('www.google.com.');
      expect(parsed.tld).to.equal('com');
      expect(parsed.sld).to.equal('google');
      expect(parsed.trd).to.equal('www');
      expect(parsed.domain).to.equal('google.com');
      expect(parsed.subdomain).to.equal('www.google.com');
      done();
    });

  });

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

});

