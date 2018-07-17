/*eslint no-var:0, prefer-arrow-callback: 0 */
'use strict';


var Assert = require('assert');
var Psl = require('../');

var Data = [
  {
    value: 'google.co.uk',
    expected: 'google.co.uk'
  },
  {
    value: 'search.google.com',
    expected: 'google.com'
  },
  {
    value: 'one.playground.xyz',
    expected: 'playground.xyz'
  }
];

describe('psl.getFast()', function () {

  Psl.precomputeFastRules(Data.map(function (item) {

    return item.expected;
  }));

  Data.forEach(function (item) {

    it('psl.getFast(' + item.value + ') should return ' + item.expected, function () {

      Assert.equal(Psl.getFast(item.value), item.expected);
    });

  });

  it('psl.getFast(example.gov.uk) should return null for non-precomputed domain', function () {

    Assert.equal(Psl.getFast('example.gov.uk'), null);
  });
});

