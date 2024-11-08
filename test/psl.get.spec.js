import assert from 'assert';
import psl from '../index.js';
import mozData from './data/mozilla.js';

describe('psl.get()', () => {
  mozData.forEach((item) => {
    it('psl.get(' + item.value + ') should return ' + item.expected, () => {
      assert.equal(psl.get(item.value), item.expected);
    });
  });
});
