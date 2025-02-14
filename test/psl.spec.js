import assert from 'assert';
import psl from '../index.js';

describe('psl', () => {
  it('should be an obj with parse, get and isValid methods', () => {
    assert.equal(typeof psl.parse, 'function');
    assert.equal(typeof psl.get, 'function');
    assert.equal(typeof psl.isValid, 'function');
    assert.equal(typeof psl.addRule, 'function');
  });
});
