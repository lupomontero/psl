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

  var domainParts = domain.split('.').filter(function (part) {
    return part !== '';
  });

  // Non-Internet TLD
  if (domainParts[domainParts.length - 1] === 'local') { return parsed; }

  function handlePunycode() {
    if (!/xn--/.test(domain)) { return parsed; }
    if (parsed.domain) {
      parsed.domain = punycode.toASCII(parsed.domain);
    }
    if (parsed.subdomain) {
      parsed.subdomain = punycode.toASCII(parsed.subdomain);
    }
    return parsed;
  }

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
// Get public suffix.
//
exports.get = function (domain) {
  if (!domain) { return null; }
  var parsed = exports.parse(domain);
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

