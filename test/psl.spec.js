/*eslint no-var:0, prefer-arrow-callback: 0 */
'use strict';


var Assert = require('assert');
var Psl = require('../');


describe('psl', function () {

  it('should be an obj with parse, get and isValid methods', function () {

    Assert.equal(typeof Psl.parse, 'function');
    Assert.equal(typeof Psl.get, 'function');
    Assert.equal(typeof Psl.isValid, 'function');
  });

});

