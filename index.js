var punycode = require('punycode');

//
// Read rules from file.
//
var rules = require('./data/rules.json').map(function (rule) {
  return {
    rule: rule,
    suffix: rule.replace(/^(\*\.|\!)/, ''),
    wildcard: rule.charAt(0) === '*',
    exception: rule.charAt(0) === '!'
  };
});


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
  var punyDomain = punycode.toASCII(domain);
  return rules.reduce(function (memo, rule) {
    var punySuffix = punycode.toASCII(rule.suffix);
    if (!endsWith(punyDomain, '.' + punySuffix) && punyDomain !== punySuffix) {
      return memo;
    }
    //if (memo) {
    //  var memoSuffix = punycode.toASCII(memo.suffix);
    //  if (memoSuffix.length >= punySuffix.length) {
    //    return memo;
    //  }
    //}
    return rule;
  }, null);
}


exports.errorCodes = {
  DOMAIN_TOO_SHORT: 'Domain name too short.',
  DOMAIN_TOO_LONG: 'Domain name too long. It should be no more than 255 chars.',
  LABEL_STARTS_WITH_DASH: 'Domain name label can not start with a dash.',
  LABEL_ENDS_WITH_DASH: 'Domain name label can not end with a dash.',
  LABEL_TOO_LONG: 'Domain name label should be at most 63 chars long.',
  LABEL_TOO_SHORT: 'Domain name label should be at least 1 character long.',
  LABEL_INVALID_CHARS: 'Domain name label can only contain alphanumeric characters or dashes.'
};


//
// Validate domain name and throw if not valid.
//
// From wikipedia:
//
// Hostnames are composed of series of labels concatenated with dots, as are all
// domain names. Each label must be between 1 and 63 characters long, and the
// entire hostname (including the delimiting dots) has a maximum of 255 chars.
//
// Allowed chars:
//
// * `a-z`
// * `0-9`
// * `-` but not as a starting or ending character
// * `.` as a separator for the textual portions of a domain name
//
// * http://en.wikipedia.org/wiki/Domain_name
// * http://en.wikipedia.org/wiki/Hostname
//
function validate(ascii) {
  if (ascii.length < 1) {
    return 'DOMAIN_TOO_SHORT';
  }
  if (ascii.length > 255) {
    return 'DOMAIN_TOO_LONG';
  }

  // Check each part's length and allowed chars.
  var labels = ascii.split('.');
  var label, i, len = labels.length;

  for (i = 0; i < len; i++) {
    label = labels[i];
    if (!label.length) {
      return 'LABEL_TOO_SHORT';
    }
    if (label.length > 63) {
      return 'LABEL_TOO_LONG';
    }
    if (label.charAt(0) === '-') {
      return 'LABEL_STARTS_WITH_DASH';
    }
    if (label.charAt(label.length - 1) === '-') {
      return 'LABEL_ENDS_WITH_DASH';
    }
    if (!/^[a-z0-9\-]+$/.test(label)) {
      return 'LABEL_INVALID_CHARS';
    }
  }
}


//
// Public API
//


//
// Parse domain.
//
exports.parse = function (input) {

  if (typeof input !== 'string') {
    throw new TypeError('Domain name must be a string.');
  }

  // Handle FQDN.
  // TODO: Simply remove trailing dot?
  if (input.charAt(input.length - 1) === '.') {
    input = input.slice(0, input.length - 1);
  }

  // Force domain to lowercase.
  input = input.toLowerCase();

  // Before we can validate we need to take care of IDNs with unicode chars.
  var ascii = punycode.toASCII(input);
  var isUnicode = (ascii !== input);
  var isPunycode = /xn--/.test(input);

  // Validate and sanitise input.
  var error = validate(ascii);
  if (error) {
    return {
      input: input,
      error: {
        message: exports.errorCodes[error],
        code: error
      }
    };
  }

  var parsed = {
    input: input,
    tld: null,
    sld: null,
    trd: null,
    domain: null,
    subdomain: null,
    listed: false
  };

  var domainParts = input.split('.');

  // Non-Internet TLD
  if (domainParts[domainParts.length - 1] === 'local') { return parsed; }

  function handlePunycode() {
    if (!isPunycode) { return parsed; }
    if (parsed.domain) {
      parsed.domain = punycode.toASCII(parsed.domain);
    }
    if (parsed.subdomain) {
      parsed.subdomain = punycode.toASCII(parsed.subdomain);
    }
    return parsed;
  }

  // We search rules by input and not `domain`, as this has already been encoded
  // to ascii and sanitised.
  var rule = find(input);

  // Unlisted tld.
  if (!rule) {
    if (domainParts.length < 2) { return parsed; }
    parsed.tld = domainParts.pop();
    parsed.sld = domainParts.pop();
    parsed.trd = domainParts.pop() || null;
    parsed.domain = [ parsed.sld, parsed.tld ].join('.');
    if (domainParts.length) {
      parsed.subdomain = domainParts.pop();
    }
    return handlePunycode();
  }

  // At this point we know the public suffix is listed.
  parsed.listed = true;

  var tldParts = rule.suffix.split('.');
  var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

  if (rule.exception) {
    privateParts.push(tldParts.shift());
  }

  if (!privateParts.length) { return handlePunycode(); }

  if (rule.wildcard) {
    tldParts.unshift(privateParts.pop()); 
  }

  if (!privateParts.length) { return handlePunycode(); }

  parsed.tld = tldParts.join('.');
  parsed.sld = privateParts.pop();
  parsed.domain = [ parsed.sld,  parsed.tld ].join('.');

  if (privateParts.length) {
    parsed.trd = privateParts.pop();
    parsed.subdomain = [ parsed.trd, parsed.domain ].join('.');
  }

  return handlePunycode();
};

//
// Get domain.
//
exports.get = function (domain) {
  if (!domain) { return null; }
  return exports.parse(domain).domain || null;
};

//
// Check whether domain belongs to a known public suffix.
//
exports.isValid = function (domain) {
  var parsed = exports.parse(domain);
  return Boolean(parsed.domain && parsed.listed);
};

