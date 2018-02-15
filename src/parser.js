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
