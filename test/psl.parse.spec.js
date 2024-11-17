import assert from 'assert';
import psl from '../index.js';
import testData from './data/parse.js';

describe('psl.parse()', () => {
  it('should throw when no domain passed', () => {
    assert.throws(() => {
      psl.parse();
    }, /Domain name must be a string/i);
  });

  testData.forEach(({ value, expected }) => {
    const testName = (
      expected?.error
        ? `returns error.${expected.error.code} for value: ${value}`
        : `parses ${value}`
    );

    it(testName, () => {
      assert.deepEqual(psl.parse(value), expected);
    });
  });
});
