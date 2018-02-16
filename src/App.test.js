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

it('resets all of the app\'s state when the Clear button is pressed', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '2+2(',
    validationClass: 'invalid',
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


it('deletes the last character and re-evaluates formula validity when the Delete button is pressed', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '2+2(',
    validationClass: 'invalid',
    result: 'Formula is invalid'
  });

  app.keyClickHandler('\u2421');

  expect(app.state.formula).toBe('2+2');
  expect(app.state.validationClass).toBe('valid');
  expect(app.state.result).toBe('0.0');
});

it('doesn\'t crash when the formula validity has zero characters and the Delete button is pressed', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '',
    validationClass: 'valid',
    result: '0.0'
  });

  app.keyClickHandler('\u2421');

  expect(app.state.formula).toBe('');
  expect(app.state.validationClass).toBe('valid');
  expect(app.state.result).toBe('0.0');
});

it('adds characters to the formula and re-evaluates its validity', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '',
    validationClass: 'valid',
    result: '0.0'
  });

  app.keyClickHandler('2');

  expect(app.state.formula).toBe('2');
  expect(app.state.validationClass).toBe('valid');
  expect(app.state.result).toBe('0.0');

  app.keyClickHandler('+');

  expect(app.state.formula).toBe('2+');
  expect(app.state.validationClass).toBe('invalid');
  expect(app.state.result).toBe('0.0');

  app.keyClickHandler('1');
  app.keyClickHandler('2');
  app.keyClickHandler('3');
  app.keyClickHandler('4');
  app.keyClickHandler('+');
  app.keyClickHandler('(');
  app.keyClickHandler('5');
  app.keyClickHandler('-');
  app.keyClickHandler('6');
  app.keyClickHandler(')');
  app.keyClickHandler('/');
  app.keyClickHandler('7');
  app.keyClickHandler('*');
  app.keyClickHandler('8');
  app.keyClickHandler('.');
  app.keyClickHandler('9');

  expect(app.state.formula).toBe('2+1234+(5-6)/7*8.9');
  expect(app.state.validationClass).toBe('valid');
  expect(app.state.result).toBe('0.0');
});

it('correctly calculates a result when it is valid, and the equals key is pressed, leaving the formula and status alone', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  let state = {
    formula: '45/(5+4)+17',
    validationClass: 'valid',
    result: '0.0'
  };
  app.setState(state);

  app.keyClickHandler('=');

  expect(app.state.formula).toBe(state.formula);
  expect(app.state.validationClass).toBe(state.validationClass);
  expect(app.state.result).toBe('22');
});

it('indicates that the formula is invalid when it is not valid, and the equals key is pressed, leaving the formula and status alone', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  let state = {
    formula: '45/(5+4)+17)',
    validationClass: 'invalid',
    result: '0.0'
  };
  app.setState(state);

  app.keyClickHandler('=');

  expect(app.state.formula).toBe(state.formula);
  expect(app.state.validationClass).toBe(state.validationClass);
  expect(app.state.result).toBe('Formula is invalid');
});

it('doesn\'t crash when the equals key is pressed and the formula is blank', () => {
  let app = ReactTestUtils.renderIntoDocument(<App />);
  app.setState({
    formula: '',
    validationClass: 'valid',
    result: '0.0'
  });

  app.keyClickHandler('=');

  expect(app.state.result).toBe('0.0');
});
