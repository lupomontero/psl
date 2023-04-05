#! /usr/bin/env node

// Deps
import fs from 'node:fs'

//Download URL and path to rules.json file.
const src = 'https://publicsuffix.org/list/effective_tld_names.dat'
const dest = new URL('../data/rules.json', import.meta.url).pathname

/**
 * Parse line (trim and ignore empty lines and comments).
 *
 * @param {string} line
 */
function parseLine (line) {

  line = line.trim()

  // Ignore empty lines and comments.
  if (!line || line.startsWith('//')) {
    return
  }

  // Only read up to first whitespace char.
  return line.split(' ')[0]

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
}


// Download rules and create rules.json file.
const res = await fetch(src)
const body = await res.text()
const rules = body.split('\n').map(parseLine).filter(Boolean)
fs.writeFileSync(dest, JSON.stringify(rules, null, '\t').replaceAll('\t', ''))
