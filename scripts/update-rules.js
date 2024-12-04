#! /usr/bin/env node

//
// Deps
//
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const END_ICANN_REGION = '// ===END ICANN DOMAINS===';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//
// Download URL and path to rules.js file.
//
const src = 'https://publicsuffix.org/list/effective_tld_names.dat';
const dest = path.join(__dirname, '../data/rules.js');

global.inIcannRegion = true;

//
// Parse line (trim and ignore empty lines and comments).
//
const parseLine = (line) => {
  const trimmed = line.trim();

  // Ignore empty lines and comments.
  if (!trimmed || (trimmed.charAt(0) === '/' && trimmed.charAt(1) === '/')) {
    if (trimmed === END_ICANN_REGION) {
      global.inIcannRegion = false;
    }
    return;
  }

  // Only read up to first whitespace char.
  const rule = trimmed.split(' ')[0];
  return [rule, (global.inIcannRegion) ? true : false];

  // const item = [rule];
  //
  // const suffix = rule.replace(/^(\*\.|\!)/, '');
  // const wildcard = rule.charAt(0) === '*';
  // const exception = rule.charAt(0) === '!';
  //
  // // If rule has no wildcard or exception we can get away with only one
  // // element in the `item` array.
  // if (suffix === rule && !wildcard && !exception) {
  //   return cb(null, item);
  // }
  //
  // item.push(suffix);
  //
  // if (wildcard) {
  //   item.push(true);
  // }
  //
  // if (exception) {
  //   item.push(true);
  // }
  //
  // cb(null, item);
};

//
// Download rules and create rules.js file.
//
fetch(src)
  .then(response => response.text())
  .then(text => text.split('\n').reduce(
    (memo, line) => {
      const parsed = parseLine(line);
      return (
        !parsed
          ? memo
          : memo.concat(parsed)
      );
    },
    [],
  ))
  .then(rules => writeFile(
    dest,
    `export default ${JSON.stringify(rules, null, 2)};`),
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
