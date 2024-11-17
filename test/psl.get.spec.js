import assert from 'assert';
import psl from '../index.js';
import mozData from './data/mozilla.js';

describe('psl.get()', () => {
  mozData.forEach(({ value, expected }) => {
    it(`psl.get('${value}') should return ${expected}`, () => {
      assert.equal(psl.get(value), expected);
    });
  });
});
