//
// Deps
//
var fs = require('fs');
var path = require('path');
var request = require('request');
var es = require('event-stream');
var JSONStream = require('JSONStream');


//
// Download URL and path to rules.json file.
//
var src = 'https://publicsuffix.org/list/effective_tld_names.dat';
var dest = path.join(__dirname, 'rules.json');


//
// Parse line (trim and ignore empty lines and comments).
//
function parseLine(line, cb) {
  var trimmed = line.trim();

  // Ignore empty lines and comments.
  if (!trimmed || (trimmed.charAt(0) === '/' && trimmed.charAt(1) === '/')) {
    return cb();
  }

  // Only read up to first whitespace char.
  var rule = trimmed.split(' ')[0];
  return cb(null, rule);

  var item = [ rule ];

  var suffix = rule.replace(/^(\*\.|\!)/, '');
  var wildcard = rule.charAt(0) === '*';
  var exception = rule.charAt(0) === '!';

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
}

//
// Download rules and create rules.json file.
//
var stringify = JSONStream.stringify('[', ',', ']');
var writeStream = fs.createWriteStream(dest);

request(src)
  .pipe(es.split())
  .pipe(es.map(parseLine))
  .pipe(stringify)
  .pipe(writeStream);

