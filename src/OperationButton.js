import { ACTIONS } from "./App"

export default function OperationButton({dispatch,oper}){
    return(
        <button onClick={()=> dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {oper}})}>
            {oper}
        </button>
    )
}