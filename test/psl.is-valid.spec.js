import assert from 'assert'
import psl from '../index.js'

describe('psl.isValid()', function () {
  [
    { value: 'google.com', expected: true },
    { value: 'www.google.com', expected: true },
    { value: 'x.yz', expected: false },
    { value: 'github.io', expected: false },
    { value: 'pages.github.io', expected: true },
    { value: 'gov.uk', expected: false },
    { value: 'data.gov.uk', expected: true }
  ].forEach(function (item) {
    it('should return ' + item.expected + ' for value: ' + item.value, function () {
      assert.equal(psl.isValid(item.value), item.expected)
    })
  })
})
