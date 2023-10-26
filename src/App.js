import { useReducer } from "react";
import "./App.css"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state, {type, payload} ){
  switch(type){ 
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currOper: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit==="0" && state.currOper ==="0"){
        return state
      }
      if (payload.digit==="." && state.currOper.includes(".")){
        return state
      }

      return {
        ...state,
        currOper: `${ state.currOper || ""}${payload.digit}`
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currOper: null,
        }
      }
      if(state.currOper == null) return state
      if(state.currOper.length ===1){
        return{
          ...state,
          currOper:null
        }
      }

      return{
        ...state,
        currOper:state.currOper.slice(0,-1)
      }

    case ACTIONS.EVALUATE:
      if(
        state.oper == null ||
        state.currOper == null ||
        state.prevOper == null
      ) {
        console.log("evalute null area")
        return state
      }


      console.log("evalute ac area")

      return{
        ...state,
        overwrite: true,
        prevOper: null,
        currOper: evaluate(state),
        oper: null
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currOper==null && state.prevOper ==null){
        return state
      }

      if(state.currOper==null){
        return{
          ...state,
          oper: payload.oper,
        }
      }

      if(state.prevOper==null){
        return{
          ...state,
          oper: payload.oper,
          prevOper: state.currOper,
          currOper: null
        }
      }

      return {
        ...state,
        prevOper: evaluate(state),
        oper: payload.oper,
        currOper: null
      }
  }
}

function evaluate({currOper,prevOper,oper}){
  const prev= parseFloat(prevOper)
  const curr= parseFloat(currOper)
  if(isNaN(prev) || isNaN(curr)) return ""
  let computation =0
  switch(oper){
    case "+":
      computation = prev+curr
      break
    case "*":
      computation = prev*curr
      break
    case "-":
        computation = prev-curr
      break
    case "÷":
        computation = prev/curr
      break
  }
  console.log("evalute fn area")
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0
})

function formatOper(operand){
  if(operand==null) return
  const [integer, decimal]=operand.split('.')
  if(decimal==null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currOper, prevOper, oper}, dispatch] = useReducer(reducer, {} )
  return (
    <div className="calc-grid">
      <div className="output">
        <div className="prev-operand">{formatOper(prevOper)} {oper}</div>
        <div className="curr-operand"> {formatOper(currOper)} </div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton oper="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton oper="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton oper="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton oper="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
