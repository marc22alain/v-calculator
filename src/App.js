import React, { Component } from 'react';
import update from 'immutability-helper';
import { replaceOperators, hasBadDecimalPoint, hasUnbalancedOperator, hasMisplacedParentheses, hasOpenParentheses } from './parser'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '',
      validationClass: 'valid',   // one of ['valid', 'invalid', 'no-closing-parens']
      result: '0.0',
      resultClass: 'in-progress',   // one of ['complete', 'invalid', 'in-progress']
    };
  }

  /*
    Processes all keypad input.
  */
  keyClickHandler(char) {
    let newResult, formula, changeSet = {}, newResultClass;
    switch (char) {
      case "=": {
        if (this.state.formula === '') {
          return;
        } else if (this.state.validationClass === 'valid') {
          // This is the only situation that is safe to call processFormula();
          newResult = processFormula(this.state.formula);
          newResultClass = 'complete';
        } else {
          newResult = 'E';
          newResultClass = 'invalid';
        }
        changeSet.result = {$set: newResult}
        changeSet.resultClass = {$set: newResultClass}
        break;
      }
      case "\u2421": {
        formula = this.state.formula;
        formula = formula.slice(0 ,formula.length - 1);
        changeSet.formula = {$set: formula}
        changeSet.result = {$set: "0.0"};
        changeSet.resultClass = {$set: 'in-progress'};
        changeSet.validationClass = {$set: checkValidity(formula)};
        break;
      }
      case "C": {
        changeSet.formula = {$set: ''}
        changeSet.result = {$set: "0.0"};
        changeSet.resultClass = {$set: 'in-progress'};
        changeSet.validationClass = {$set: 'valid'};
        break;
      }
      default: {
        formula = this.state.formula + char;
        changeSet.formula = {$set: formula}
        changeSet.result = {$set: "0.0"};
        changeSet.resultClass = {$set: 'in-progress'};
        changeSet.validationClass = {$set: checkValidity(formula)};
      }
    }
    this.setState(update(this.state, changeSet));
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
            class={this.state.validationClass + " formula-box text-box"}
          />
        </div>
        <div>
          <CalculatorOutput
            result={this.state.result}
            class={this.state.resultClass + " result-box text-box"}
          />
        </div>
        <div className="keypad">
          {this.renderKey("C", "key utility-key narrow-width")}
          {this.renderKey("\u2421", "key utility-key narrow-width")}

          {this.renderKey("(", "key operator-key narrow-width")}
          {this.renderKey(")", "key operator-key narrow-width")}
          {this.renderKey("÷", "key operator-key narrow-width")}

          {this.renderKey("7", "key number-key single-width")}
          {this.renderKey("8", "key number-key single-width")}
          {this.renderKey("9", "key number-key single-width")}
          {this.renderKey("x", "key operator-key narrow-width")}

          {this.renderKey("4", "key number-key single-width")}
          {this.renderKey("5", "key number-key single-width")}
          {this.renderKey("6", "key number-key single-width")}
          {this.renderKey("-", "key operator-key narrow-width")}

          {this.renderKey("1", "key number-key single-width")}
          {this.renderKey("2", "key number-key single-width")}
          {this.renderKey("3", "key number-key single-width")}
          {this.renderKey("+", "key operator-key narrow-width")}

          {this.renderKey("0", "key number-key double-width")}
          {this.renderKey(".", "key number-key single-width")}
          {this.renderKey("=", "key operator-key narrow-width")}
        </div>
      </div>
    );
  }
}

/*
  The CalculatorInput component displays the user's input provided through the keypad.

  props:
  - class: is the CSS class(es) to apply
  - formula: is the text to display in the field
*/
function CalculatorInput(props) {
  return (
      <div className={props.class}>{props.formula}</div>
    );
}

/*
  The CalculatorOutput component displays the evaluation of the user's input formula.

  props:
  - class: is the CSS class(es) to apply
  - result: is the text to display in the field
*/
function CalculatorOutput(props) {
  return (
      <div className={props.class}>{props.result} =</div>
    );
}

/*
  The CalculatorInput component displays the input keys in the keypad.

  props:
  - class: is the CSS class(es) to apply
  - value: the value of the key to display, and to return when clicked
  - onClick: the click() event handler
*/
function Key(props) {
  return (
      <button className={props.class} onClick={props.onClick}>{props.value}</button>
    )
}

/*
  Uses eval()!
  Therefore assumes that the formula is safe to use.
  While user input is limited to the keys defined in the calculator,
  the formula must still be checked for validity before calling this function.
*/
function processFormula(raw) {
  // First replace the pretty operators for functional ones.
  raw = replaceOperators(raw);
  // Now apply the check of last resort.
  if (hasBadDecimalPoint(raw) || hasUnbalancedOperator(raw) || hasMisplacedParentheses(raw) || hasOpenParentheses(raw)) {
    throw new Error("Invalid formula submitted for evaluation!");
  }
  // eslint-disable-next-line no-eval
  return eval(raw).toString();
}

/*
  Classifies the formula's validity:
  - 'invalid' signifies the formula has errors requiring additional input or deletion of a previous error
  - 'no-closing-parens' signifies the formula only requires closing parentheses
  - 'valid' signifies the formula is suitable to be submitted for evaluation
*/
function checkValidity(raw) {
  // First replace the pretty operators for functional ones.
  raw = replaceOperators(raw);
  if (hasBadDecimalPoint(raw) || hasUnbalancedOperator(raw) || hasMisplacedParentheses(raw)) {
    return 'invalid';
  }
  if (hasOpenParentheses(raw)) {
    return 'no-closing-parens';
  }
  return 'valid';
}

export default App;
