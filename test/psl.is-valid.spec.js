/*eslint no-var:0, prefer-arrow-callback: 0 */
'use strict';


var Assert = require('assert');
var Psl = require('../');


describe('psl.isValid()', function () {

  [
    { value: 'google.com', expected: true },
    { value: 'www.google.com', expected: true },
    { value: 'x.yz', expected: false }
  ].forEach(function (item) {

    it('should return ' + item.expected + ' for value: ' + item.value, function () {

      Assert.equal(Psl.isValid(item.value), item.expected);
    });

  });

});

