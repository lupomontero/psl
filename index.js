var fs = require('fs');
var path = require('path');
var punycode = require('punycode');

//
// Read rules from file.
//
var filepath = path.join(__dirname, 'data', 'effective_tld_names.dat');
var file = fs.readFileSync(filepath, 'utf-8');
var rules = file.split('\n').reduce(function (memo, line) {
  line = line.trim();
  if ((line.charAt(0) === '/' && line.charAt(1) === '/') || !line) {
    return memo;
  }
  // Only read up to first whitespace char.
  line = line.split(' ')[0];
  memo.push({
    suffix: line.replace(/^(\*\.|\!)/, ''),
    wildcard: line.charAt(0) === '*',
    exception: line.charAt(0) === '!'
  });
  return memo;
}, []);


//
// Check is given string ends with `suffix`.
//
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


//
// Find rule for a given domain.
//
function find(domain) {
  return rules.reduce(function (memo, rule) {
    if (!endsWith(punycode.toUnicode(domain), rule.suffix)) { return memo; }
    if (memo && memo.suffix && memo.suffix.length > rule.suffix.length) {
      return memo;
    }
    return rule;
  }, null);
}


//
// Public API
//


//
// Parse domain.
//
exports.parse = function (domain) {
  var parsed = {
    tld: null,
    sld: null,
    trd: null,
    domain: null,
    subdomain: null,
    listed: false
  };

  if (!domain) { return parsed; }

  // Leading dot.
  if (domain.charAt(0) === '.') { return parsed; }

  // Handle FQDN.
  // TODO: Simply remove trailing dot?
  if (domain.charAt(domain.length - 1) === '.') {
    domain = domain.slice(0, domain.length - 1);
  }

  // Force domain to lowercase.
  domain = domain.toLowerCase();

  var isPunycode = /xn--/.test(domain);
  var domainParts = domain.split('.').filter(function (part) {
    return part !== '';
  });

  var rule = find(domain);

  // Unlisted tld.
  if (!rule) {
    if (domainParts.length < 2) { return parsed; }
    parsed.tld = domainParts.pop();
    parsed.sld = domainParts.pop();
    parsed.trd = domainParts.pop();
    parsed.domain = [ parsed.sld, parsed.tld ].join('.');
    if (domainParts.length) {
      parsed.subdomain = domainParts.pop();
    }
    if (isPunycode) {
      parsed.domain = punycode.toASCII(parsed.domain);
      if (parsed.subdomain) {
        parsed.subdomain = punycode.toASCII(parsed.subdomain);
      }
    }
    return parsed;
  }

  // At this point we know the public suffix is listed.
  parsed.listed = true;

  var tldParts = rule.suffix.split('.');
  var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

  if (rule.exception) {
    privateParts.push(tldParts.shift());
  }

  if (!privateParts.length) { return parsed; }

  if (rule.wildcard) {
    tldParts.unshift(privateParts.pop()); 
  }

  if (!privateParts.length) { return parsed; }

  parsed.tld = tldParts.join('.');
  parsed.sld = privateParts.pop();

  if (!parsed.sld) { return parsed; }

  parsed.domain = [ parsed.sld,  parsed.tld ].join('.');

  if (privateParts.length) {
    parsed.trd = privateParts.pop();
    parsed.subdomain = [ parsed.trd, parsed.domain ].join('.');
  }

  if (isPunycode) {
    parsed.domain = punycode.toASCII(parsed.domain);
    if (parsed.subdomain) {
      parsed.subdomain = punycode.toASCII(parsed.subdomain);
    }
  }

  return parsed;
};

//
// Get public suffix.
//
exports.get = function (domain) {
  if (!domain) { return null; }
  var parsed = exports.parse(domain) || {};
  return parsed.domain || null;
};

//
// Check whether a domain is a public suffix domain.
//
exports.isValid = function (domain) {
  var rule = find(domain);
  var parsed = exports.parse(domain);
  return parsed.domain && parsed.listed;
};

