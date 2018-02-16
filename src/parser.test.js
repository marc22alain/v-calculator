import { replaceOperators, hasBadDecimalPoint, hasUnbalancedOperator, hasMisplacedParentheses, hasOpenParentheses } from './parser';

it('accepts/rejects on simple input', () => {
  expect(replaceOperators('2+2')).toBe('2+2');
  expect(replaceOperators('2x2')).toBe('2*2');
  expect(replaceOperators('2-2')).toBe('2-2');
  expect(replaceOperators('2÷2')).toBe('2/2');
});

it('finds invalid uses of decimal points', () => {
  // Fair use of decimal points.
  expect(hasBadDecimalPoint('1+5')).toBe(false);
  expect(hasBadDecimalPoint('1+5.')).toBe(false);
  expect(hasBadDecimalPoint('1+.5')).toBe(false);
  expect(hasBadDecimalPoint('1+5.0')).toBe(false);
  // Incorrect use of decimal points.
  expect(hasBadDecimalPoint('1+5..0')).toBe(true);
  expect(hasBadDecimalPoint('1+5.5.5')).toBe(true);
  expect(hasBadDecimalPoint('1+.+5')).toBe(true);
  expect(hasBadDecimalPoint('1+5+.')).toBe(true);
});

it('finds invalid uses of operators', () => {
  // Fair use of operators.
  expect(hasUnbalancedOperator('1+5')).toBe(false);
  expect(hasUnbalancedOperator('1*5')).toBe(false);
  expect(hasUnbalancedOperator('1-5')).toBe(false);
  expect(hasUnbalancedOperator('1/5')).toBe(false);
  expect(hasUnbalancedOperator('-5')).toBe(false);
  expect(hasUnbalancedOperator('1-+5')).toBe(false);
  expect(hasUnbalancedOperator('1+-5')).toBe(false);
  expect(hasUnbalancedOperator('1/-5')).toBe(false);
  expect(hasUnbalancedOperator('1*-5')).toBe(false);
  expect(hasUnbalancedOperator('2+2*5')).toBe(false);
  // Incorrect use of operators.
  expect(hasUnbalancedOperator('1++5')).toBe(true);
  expect(hasUnbalancedOperator('1--5')).toBe(true);
  expect(hasUnbalancedOperator('1**5')).toBe(true);
  expect(hasUnbalancedOperator('1+*5')).toBe(true);
  expect(hasUnbalancedOperator('1*+5')).toBe(true);
  expect(hasUnbalancedOperator('1*/5')).toBe(true);
  expect(hasUnbalancedOperator('1/*5')).toBe(true);
  expect(hasUnbalancedOperator('1//5')).toBe(true);
  expect(hasUnbalancedOperator('+5')).toBe(true);
  expect(hasUnbalancedOperator('*5')).toBe(true);
  expect(hasUnbalancedOperator('/5')).toBe(true);
  expect(hasUnbalancedOperator('5+')).toBe(true);
  expect(hasUnbalancedOperator('5-')).toBe(true);
  expect(hasUnbalancedOperator('5*')).toBe(true);
  expect(hasUnbalancedOperator('5/')).toBe(true);
});

it('finds invalid uses of parentheses', () => {
  // Fair use of parentheses.
  expect(hasMisplacedParentheses('(1)')).toBe(false);
  expect(hasMisplacedParentheses('(1)')).toBe(false);
  expect(hasMisplacedParentheses('(1)+')).toBe(false);
  expect(hasMisplacedParentheses('+(1)')).toBe(false);
  expect(hasMisplacedParentheses('(1')).toBe(false);

  // Incorrect use of parentheses.
  expect(hasMisplacedParentheses('1(1)')).toBe(true);
  expect(hasMisplacedParentheses('(1))1')).toBe(true);
  expect(hasMisplacedParentheses('(+1)')).toBe(true);
  expect(hasMisplacedParentheses('(1+)')).toBe(true);
  expect(hasMisplacedParentheses('1)')).toBe(true);
  expect(hasMisplacedParentheses('(8+9)*(')).toBe(true);
  expect(hasMisplacedParentheses('5.(')).toBe(true);
  expect(hasMisplacedParentheses('(5).5')).toBe(true);
  expect(hasMisplacedParentheses('(5).+')).toBe(true);
  expect(hasMisplacedParentheses('5+()')).toBe(true);
});

it('finds when closing parentheses are required', () => {
  // Balanced number of parentheses.
  expect(hasOpenParentheses('()')).toBe(false);
  expect(hasOpenParentheses('()()')).toBe(false);
  expect(hasOpenParentheses('(())')).toBe(false);

  // Unequal number of parentheses.
  expect(hasOpenParentheses('((')).toBe(true);
  expect(hasOpenParentheses('(()')).toBe(true);
  expect(hasOpenParentheses('()(')).toBe(true);
});
