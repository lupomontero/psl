export default [
  // { value: undefined, expected: Error },
  {
    value: '',
    expected: {
      input: '',
      error: {
        message: 'Domain name too short.',
        code: 'DOMAIN_TOO_SHORT',
      },
    },
  },
  {
    value: Array(256).fill('x').join(''),
    expected: {
      input: Array(256).fill('x').join(''),
      error: {
        message: 'Domain name too long. It should be no more than 255 chars.',
        code: 'DOMAIN_TOO_LONG',
      },
    },
  },
  {
    value: 'a..com',
    expected: {
      input: 'a..com',
      error: {
        message: 'Domain name label should be at least 1 character long.',
        code: 'LABEL_TOO_SHORT',
      },
    },
  },
  {
    value: Array(64).fill('x').join('') + '.com',
    expected: {
      input: Array(64).fill('x').join('') + '.com',
      error: {
        message: 'Domain name label should be at most 63 chars long.',
        code: 'LABEL_TOO_LONG',
      },
    },
  },
  {
    value: '-foo',
    expected: {
      input: '-foo',
      error: {
        message: 'Domain name label can not start with a dash.',
        code: 'LABEL_STARTS_WITH_DASH',
      },
    },
  },
  {
    value: 'aa.-foo.com',
    expected: {
      input: 'aa.-foo.com',
      error: {
        message: 'Domain name label can not start with a dash.',
        code: 'LABEL_STARTS_WITH_DASH',
      },
    },
  },
  {
    value: 'foo-',
    expected: {
      input: 'foo-',
      error: {
        message: 'Domain name label can not end with a dash.',
        code: 'LABEL_ENDS_WITH_DASH',
      },
    },
  },
  {
    value: 'foo-.net',
    expected: {
      input: 'foo-.net',
      error: {
        message: 'Domain name label can not end with a dash.',
        code: 'LABEL_ENDS_WITH_DASH',
      },
    },
  },
  {
    value: 'foo-^%&!*&^.com',
    expected: {
      input: 'foo-^%&!*&^.com',
      error: {
        message: 'Domain name label can only contain alphanumeric characters or dashes.',
        code: 'LABEL_INVALID_CHARS',
      },
    },
  },
  {
    value: 'xn----dqo34k.xn----dqo34k',
    expected: {
      input: 'xn----dqo34k.xn----dqo34k',
      tld: 'xn----dqo34k',
      sld: 'xn----dqo34k',
      domain: 'xn----dqo34k.xn----dqo34k',
      subdomain: null,
      listed: false,
    },
  },
  {
    value: 'foo.blogspot.co.uk',
    expected: {
      input: 'foo.blogspot.co.uk',
      tld: 'blogspot.co.uk',
      sld: 'foo',
      domain: 'foo.blogspot.co.uk',
      subdomain: null,
      listed: true,
    },
  },
  {
    value: 'google.com',
    expected: {
      input: 'google.com',
      tld: 'com',
      sld: 'google',
      domain: 'google.com',
      subdomain: null,
      listed: true,
    },
  },
  {
    value: 'www.google.com',
    expected: {
      input: 'www.google.com',
      tld: 'com',
      sld: 'google',
      domain: 'google.com',
      subdomain: 'www',
      listed: true,
    },
  },
  // FQDN
  {
    value: 'www.google.com.',
    expected: {
      input: 'www.google.com.',
      tld: 'com',
      sld: 'google',
      domain: 'google.com',
      subdomain: 'www',
      listed: true,
    },
  },
  {
    value: 'a.b.c.d.foo.com',
    expected: {
      input: 'a.b.c.d.foo.com',
      tld: 'com',
      sld: 'foo',
      domain: 'foo.com',
      subdomain: 'a.b.c.d',
      listed: true,
    },
  },
  {
    value: 'data.gov.uk',
    expected: {
      input: 'data.gov.uk',
      tld: 'gov.uk',
      sld: 'data',
      domain: 'data.gov.uk',
      subdomain: null,
      listed: true,
    },
  },
  {
    value: 'gov.uk',
    expected: {
      input: 'gov.uk',
      tld: 'gov.uk',
      sld: null,
      domain: null,
      subdomain: null,
      listed: true,
    },
  },
  {
    value: 'github.io',
    expected: {
      input: 'github.io',
      tld: 'github.io',
      sld: null,
      domain: null,
      subdomain: null,
      listed: true,
    },
  },
  {
    value: 'testing.com.in',
    expected: {
      input: 'testing.com.in',
      tld: 'com.in',
      sld: 'testing',
      domain: 'testing.com.in',
      subdomain: null,
      listed: true,
    },
  },
];