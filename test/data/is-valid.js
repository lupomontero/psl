module.exports = [
  { value: 'google.com', expected: true },
  { value: 'www.google.com', expected: true },
  { value: 'x.yz', expected: false },
  { value: 'github.io', expected: false },
  { value: 'pages.github.io', expected: true },
  { value: 'gov.uk', expected: false },
  { value: 'data.gov.uk', expected: true }
];
