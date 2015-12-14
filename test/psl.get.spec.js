/*eslint no-var:0, prefer-arrow-callback: 0 */
'use strict';


var Assert = require('assert');
var Psl = require('../');
var Data = require('./mozilla-data');


describe('psl.get()', function () {

  Data.forEach(function (item) {

    it('psl.get(' + item.value + ') should return ' + item.expected, function () {

      Assert.equal(Psl.get(item.value), item.expected);
    });

  });

});

