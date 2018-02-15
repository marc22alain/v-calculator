import { replaceOperators } from './parser';

it('accepts/rejects on simple input', () => {
  expect(replaceOperators('2+2')).toBe('2+2');
  expect(replaceOperators('2x2')).toBe('2*2');
  expect(replaceOperators('2-2')).toBe('2-2');
  expect(replaceOperators('2÷2')).toBe('2/2');
});
