'use strict';

//
// Deps
//
const Fs = require('fs');
const Path = require('path');
const Request = require('request');
const EventStream = require('event-stream');
const JSONStream = require('JSONStream');


const internals = {};


//
// Download URL and path to rules.json file.
//
internals.src = 'https://publicsuffix.org/list/effective_tld_names.dat';
internals.dest = Path.join(__dirname, 'rules.json');


//
// Parse line (trim and ignore empty lines and comments).
//
internals.parseLine = function (line, cb) {

  const trimmed = line.trim();

  // Ignore empty lines and comments.
  if (!trimmed || (trimmed.charAt(0) === '/' && trimmed.charAt(1) === '/')) {
    return cb();
  }

  // Only read up to first whitespace char.
  const rule = trimmed.split(' ')[0];
  return cb(null, rule);

  const item = [rule];

  const suffix = rule.replace(/^(\*\.|\!)/, '');
  const wildcard = rule.charAt(0) === '*';
  const exception = rule.charAt(0) === '!';

  // If rule has no wildcard or exception we can get away with only one
  // element in the `item` array.
  if (suffix === rule && !wildcard && !exception) {
    return cb(null, item);
  }

  item.push(suffix);

  if (wildcard) {
    item.push(true);
  }

  if (exception) {
    item.push(true);
  }

  cb(null, item);
};


//
// Download rules and create rules.json file.
//
Request(internals.src)
  .pipe(EventStream.split())
  .pipe(EventStream.map(internals.parseLine))
  .pipe(JSONStream.stringify('[', ',', ']'))
  .pipe(Fs.createWriteStream(internals.dest));

