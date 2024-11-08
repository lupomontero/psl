import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import testData from './data/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.resolve(__dirname, '../dist/psl.js');

test.beforeEach(async ({ page }) => {
  await page.addScriptTag({
    content: await fs.readFile(scriptPath, 'utf8'),
  });
});

test('psl.get() [Mozilla Data]', async ({ page }) => {
  const results = await page.evaluate(
    mozData => mozData.map(({ value, expected }) => ({
      value,
      expected,
      actual: window.psl.get(value),
    })),
    testData.mozilla,
  );

  results.forEach(({ value, expected, actual }) => {
    expect(actual).toBe(expected, `psl.get(${value}) should return ${expected}`);
  });
});

test('psl.isValid()', async ({ page }) => {
  const results = await page.evaluate(
    testData => testData.map(({ value, expected }) => ({
      value,
      expected,
      actual: window.psl.isValid(value),
    })),
    testData.isValid,
  );

  results.forEach(({ value, expected, actual }) => {
    expect(actual).toBe(expected, `psl.isValid(${value}) should return ${expected}`);
  });
});

test('psl.parse()', async ({ page }) => {
  const results = await page.evaluate(
    testData => testData.map(({ value, expected }) => ({
      value,
      expected,
      actual: window.psl.parse(value),
    })),
    testData.parse,
  );

  results.forEach(({ value, expected, actual }) => {
    expect(actual).toStrictEqual(expected, `psl.parse(${value}) should return ${expected}`);
  });
});
