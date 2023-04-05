import Assert from 'assert'
import * as psl from '../index.js'

describe('psl', function () {
  it('should be an obj with parse, get and isValid methods', function () {
    Assert.equal(typeof psl.parse, 'function')
    Assert.equal(typeof psl.get, 'function')
    Assert.equal(typeof psl.isValid, 'function')
  })
})
