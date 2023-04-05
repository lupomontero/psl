import assert from 'assert'
import * as psl from '../index.js'
import Data from './mozilla-data.js'

describe('psl.get()', function () {
  Data.forEach(item => {
    it('psl.get(' + item.value + ') should return ' + item.expected, function () {
      assert.equal(psl.get(item.value), item.expected)
    })
  })
})
