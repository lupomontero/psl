var assert = require('assert');
var psl = require('psl/dist/psl.es5.cjs');


assert.deepEqual(psl.parse('lupomontero.github.io'), {
  input: 'lupomontero.github.io',
  tld: 'github.io',
  sld: 'lupomontero',
  domain: 'lupomontero.github.io',
  subdomain: null,
  listed: true,
});
