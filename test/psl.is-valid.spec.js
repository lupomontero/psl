import assert from 'assert';
import psl from '../index.js';
import testData from './data/is-valid.js';

describe('psl.isValid()', () => {
  testData.forEach(({ value, expected }) => {
    it(`should return ${expected} for value: ${value}`, () => {
      assert.equal(psl.isValid(value), expected);
    });
  });
});
