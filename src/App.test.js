import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactTestUtils from 'react-dom/test-utils';

jest.dontMock('./App');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('resets the formula', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '2+2(',
    validationClass: 'invalid',   // ['valid', 'invalid', 'no-closing-parens']
    result: 'Formula is invalid'
  });
  expect(app.state.formula).toBe('2+2(');
  expect(app.state.validationClass).toBe('invalid');
  expect(app.state.result).toBe('Formula is invalid');

  app.keyClickHandler('C');

  expect(app.state.formula).toBe('');
  expect(app.state.validationClass).toBe('valid');
  expect(app.state.result).toBe('0.0');
});

