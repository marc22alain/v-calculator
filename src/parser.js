/*
  The strategy for formula input string validation is NOT to have one complex REGEX to verify it.
  Rather, it is to check that each formula symbol type is used corectly.
  Not only is this easier to develop and test, it is also more easily extensible to new formula symbol types.
*/

/*
  Replaces the nice-looking characters for functional operators:
  'x' => '*'
  '÷' => '/'

  Parameter:
  - an input string

  Return:
  - the input string with functional operator characters replacing the pretty characters
*/
export function replaceOperators(raw) {
  raw = raw.replace(/x/g, '*');
  raw = raw.replace(/÷/g, '/');
  return raw;
}

export function hasBadDecimalPoint(raw) {
  return /\.\.|\.[0-9]+\.|[-+/*]+\.[-+/*]+|[^0-9]+\.$/.test(raw);
}

export function hasUnbalancedOperator(raw) {
  return /^[+/*]|[+/*]{2,}|--|[-+/*]$/.test(raw);
}

export function hasMisplacedParentheses(raw) {
  let numOpening = raw.match(/\(/g) ? raw.match(/\(/g).length : 0;
  let numClosing = raw.match(/\)/g) ? raw.match(/\)/g).length : 0;
  return /[0-9.)]+\(|\)[0-9.]+|\([)-+/*]+|[-+/*]+\)|[-+/*]+\($/.test(raw) || numOpening < numClosing;
}

export function hasOpenParentheses(raw) {
  let numOpening = raw.match(/\(/g) ? raw.match(/\(/g).length : 0;
  let numClosing = raw.match(/\)/g) ? raw.match(/\)/g).length : 0;
  return numOpening > numClosing;
}
