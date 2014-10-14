# psl (Public Suffix List)

[![Build Status](https://travis-ci.org/wrangr/psl.svg?branch=master)](https://travis-ci.org/wrangr/psl)

`psl` is a `JavaScript` domain name parser based on the
[Public Suffix List](https://publicsuffix.org/).

This implementation is tested against the
[test data hosted by Mozilla](http://mxr.mozilla.org/mozilla-central/source/netwerk/test/unit/data/test_psl.txt?raw=1)
and kindly provided by [Comodo](https://www.comodo.com/).


## What is the Public Suffix List?

The Public Suffix List is a cross-vendor initiative to provide an accurate list
of domain name suffixes.

The Public Suffix List is an initiative of the Mozilla Project, but is
maintained as a community resource. It is available for use in any software,
but was originally created to meet the needs of browser manufacturers.

A "public suffix" is one under which Internet users can directly register names.
Some examples of public suffixes are ".com", ".co.uk" and "pvt.k12.wy.us". The
Public Suffix List is a list of all known public suffixes.

Source: http://publicsuffix.org


## Installation

### Node.js

```sh
npm install --save psl
```

### Browser

Download [psl.min.js](https://raw.githubusercontent.com/wrangr/psl/master/dist/psl.min.js)
and include it in a script tag.

```html
<script src="psl.min.js"></script>
```

This script is browserified and wrapped in a [umd](https://github.com/umdjs/umd)
wrapper so you should be able to use it standalone or together with a module
loader.

## API

### `psl.parse(domain)`

Parse domain based on Public Suffix List. Returns an `Object` with the following
properties:

* `tld`
* `sld`
* `trd`
* `domain`
* `subdomain`

#### Example:

```js
var psl = require('psl');

// Parse domain without subdomain
var parsed = psl.parse('google.com');
console.log(parsed.tld); // 'com'
console.log(parsed.sld); // 'google'
console.log(parsed.trd); // null
console.log(parsed.domain); // 'google.com'
console.log(parsed.subdomain); // null

// Parse domain with subdomain
var parsed = psl.parse('www.google.com');
console.log(parsed.tld); // 'com'
console.log(parsed.sld); // 'google'
console.log(parsed.trd); // 'www'
console.log(parsed.domain); // 'google.com'
console.log(parsed.subdomain); // 'www.google.com'
```

### `psl.get(domain)`

Get domain's Public Suffix. Returns a `String` with the Public Suffix if found
or `null` if not found.

#### Example:

```js
var psl = require('psl');

// null input.
psl.get(null); // null

// Mixed case.
psl.get('COM'); // null
psl.get('example.COM'); // 'example.com'
psl.get('WwW.example.COM'); // 'example.com'

// Unlisted TLD.
psl.get('example'); // null
psl.get('example.example'); // 'example.example'
psl.get('b.example.example'); // 'example.example'
psl.get('a.b.example.example'); // 'example.example'

// TLD with only 1 rule.
psl.get('biz'); // null
psl.get('domain.biz'); // 'domain.biz'
psl.get('b.domain.biz'); // 'domain.biz'
psl.get('a.b.domain.biz'); // 'domain.biz'

// TLD with some 2-level rules.
psl.get('uk.com'); // null);
psl.get('example.uk.com'); // 'example.uk.com');
psl.get('b.example.uk.com'); // 'example.uk.com');

// TLD with only 1 (wildcard) rule.
psl.get('cy'); // null
psl.get('c.cy'); // null
psl.get('b.c.cy'); // 'b.c.cy'
psl.get('a.b.c.cy'); // 'b.c.cy'

// More complex TLD.
psl.get('c.kobe.jp'); // null
psl.get('b.c.kobe.jp'); // 'b.c.kobe.jp'
psl.get('a.b.c.kobe.jp'); // 'b.c.kobe.jp'
psl.get('city.kobe.jp'); // 'city.kobe.jp'
psl.get('www.city.kobe.jp'); // 'city.kobe.jp'

// IDN labels.
psl.get('食狮.com.cn'); // '食狮.com.cn'
psl.get('食狮.公司.cn'); // '食狮.公司.cn'
psl.get('www.食狮.公司.cn'); // '食狮.公司.cn'

// Same as above, but punycoded.
psl.get('xn--85x722f.com.cn'); // 'xn--85x722f.com.cn'
psl.get('xn--85x722f.xn--55qx5d.cn'); // 'xn--85x722f.xn--55qx5d.cn'
psl.get('www.xn--85x722f.xn--55qx5d.cn'); // 'xn--85x722f.xn--55qx5d.cn'
```

### `psl.isValid(domain)`

Check whether a domain has a valid Public Suffix. Returns a `Boolean` indicating
whether the domain has a valid Public Suffix.

#### Example

```js
var psl = require('psl');

psl.isValid('google.com'); // true
psl.isValid('www.google.com'); // true
psl.isValid('x.yz'); // false
```


## Testing and Building

Test are written using [`tape`](https://www.npmjs.org/package/tape) and can be
run in three different environments: `node`, `phantomjs` and local browsers.

```sh
# This will run the `jshint`, `test-node` and `test-phantom` grunt tasks.
npm test

# Individual test environments
grunt test-node     # Run tests in node only.
grunt test-phantom  # Run tests in phantomjs only.
grunt test-local    # Run tests in local browser.

# Build data (parse raw list) and create dist files
grunt build
```

Feel free to fork if you see possible improvements!


## Acknowledgements

* Mozilla Foundation's [Public Suffix List](https://publicsuffix.org/)
* Thanks to Rob Stradling of [Comodo](https://www.comodo.com/) for providing
  test data.
* Inspired by [weppos/publicsuffix-ruby](https://github.com/weppos/publicsuffix-ruby)


## License

The MIT License (MIT)

Copyright (c) 2014 Lupo Montero &lt;lupo@wrangr.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
