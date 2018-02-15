import React, { Component } from 'react';
import update from 'immutability-helper';
import { replaceOperators } from './parser'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '2+2',
      validationClass: 'valid',
      result: '0.0'
    };
  }

  keyClickHandler(char) {
    if (char === "=") {
      let formula = this.state.formula;
      let newResult = processFormula(formula)
      let newState = update(this.state, {result: {$set: newResult}});
      this.setState(newState);
    } else {
      let formula = this.state.formula;
      let newState = update(this.state, {formula: {$set: formula + char}});
      this.setState(newState);
    }
  }

  renderKey(char, classNames) {
    return (
      <Key
        value={char}
        class={classNames}
        onClick={() => this.keyClickHandler(char)}
      />
    );

  }

  render() {
    return (
      <div className="App">
        <div>
          <CalculatorInput
            formula={this.state.formula}
            class={this.state.validationClass}
          />
        </div>
        <div>
          <CalculatorOutput
            result={this.state.result}
          />
        </div>
        <div className="keypad">
          {this.renderKey("C", "key operator-key single-width")}
          {this.renderKey("(", "key operator-key single-width")}
          {this.renderKey(")", "key operator-key single-width")}
          {this.renderKey("÷", "key operator-key single-width")}

          {this.renderKey("7", "key number-key single-width")}
          {this.renderKey("8", "key number-key single-width")}
          {this.renderKey("9", "key number-key single-width")}
          {this.renderKey("x", "key operator-key single-width")}

          {this.renderKey("4", "key number-key single-width")}
          {this.renderKey("5", "key number-key single-width")}
          {this.renderKey("6", "key number-key single-width")}
          {this.renderKey("-", "key operator-key single-width")}

          {this.renderKey("1", "key number-key single-width")}
          {this.renderKey("2", "key number-key single-width")}
          {this.renderKey("3", "key number-key single-width")}
          {this.renderKey("+", "key operator-key single-width")}

          {this.renderKey("0", "key number-key double-width")}
          {this.renderKey(".", "key number-key single-width")}
          {this.renderKey("=", "key operator-key single-width")}
        </div>
      </div>
    );
  }
}

function CalculatorInput(props) {
  return (
      <div className={props.class} contentEditable>{props.formula}</div>
    );
}

function CalculatorOutput(props) {
  return (
      <p className="result">{props.result}</p>
    );
}

function Key(props) {
  return (
      <button className={props.class} onClick={props.onClick}>{props.value}</button>
    )
}

function processFormula(raw) {
  raw = replaceOperators(raw);
  // eslint-disable-next-line no-eval
  return eval(raw).toString();
}

export default App;

