import "./App.css";
import Formula from "./Formula";
import Output from "./Output";
import Buttons from "./Buttons";
import { useState } from "react";

function App() {
  const isOperator = /[*/+-]+/;

  const initialState = {
    currentVal: "0",
    prevVal: "0",
    formula: "",
    stack: [],
    prevStack: [],
    currentSign: "pos",
    lastClicked: "",
    evaluated: false,
  };
  const [calc, setCalc] = useState(initialState);

  function handleDecimal(e) {
    let value = e.target.value;
    let currentVal = calc.currentVal;
    currentVal =
      currentVal === "."
        ? "0" + value
        : currentVal + value;

    currentVal = currentVal.replace("..", ".");
    let step1 = currentVal.substr(0, currentVal.indexOf('.'));
    let step2 = currentVal.substr(currentVal.indexOf('.') + 1).replace(".", "")
    setCalc((prev) => ({ ...prev, currentVal: step1 + "." + step2 }));
  }
  function handleEvaluate() {
    let lestack = calc.stack;
    let currentVal = calc.currentVal;
    lestack.push(currentVal);
    let expression = lestack.join("");
    currentVal = eval(expression.replaceAll("--", "+").replaceAll("++","+"));
    lestack.push("=");
    lestack.push(currentVal);

    setCalc(prev => ({
      ...prev, currentVal: currentVal, prevStack: lestack, stack: [], evaluated: true
    }))
  }
  function initialize() {
    setCalc(initialState);
  }
  function handleNumbers(e) {
    let value = e.target.value;
    let currentVal = calc.currentVal;
    currentVal =
      currentVal === "0"
        ? value
        : currentVal + value;

    setCalc((prev) => ({ ...prev, currentVal: currentVal }));
  }

  function handleOperators(e) {
    let stack = calc.stack;
    if(calc.currentVal!== "")
      stack.push(calc.currentVal)
    if (isOperator.test(stack[stack.length-1])) {
        stack[stack.length-1] += e.target.value;
    }
    else {
      stack.push(e.target.value);
    }
    let symbols = stack[stack.length - 1];
    let lastChar = symbols.substr(symbols.length - 1, 1);
    stack[stack.length - 1] = lastChar !== "-" ? lastChar : symbols;
    
    setCalc((prev) => ({ ...prev, stack: stack, currentVal: "", evaluated: false }));
  }
  return (
    <div className="App">
      <div className="calculator">
        <Formula formula={calc.evaluated ? calc.prevStack.join("") : calc.stack.join("")} />
        <Output output={calc.currentVal} />
        <Buttons
          decimal={handleDecimal}
          evaluate={handleEvaluate}
          initialize={initialize}
          numbers={handleNumbers}
          operators={handleOperators}
        />
      </div>
    </div>
  );
}

export default App;
