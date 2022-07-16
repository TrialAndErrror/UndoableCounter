import {useReducer} from 'react'
import './App.css'

/*
* https://frontendeval.com/questions/undoable-counter
*
* Create a simple counter with undo/redo functionality
*/
const initialState = {
    value: 0,
    history: [],
    undo_history: []
}

interface stateProp {
    value: number,
    history: string[]
    undo_history: string[]
}

function evaluateOperation(value: number, action: string): number {
    const operator: string = action.charAt(0)
    const operation_value: string = action.slice(1)

    switch (operator) {
        case "+":
            return value + eval(operation_value);
        case "-":
            return value - eval(operation_value);
        default:
            return 0
    }
}

function reverseAction(action: string): string {
    return (action.split(" ")[0].startsWith("+") ? action.replace("+", "-") : action.replace("-", "+"))
}


function reducer(state: stateProp, action: string): stateProp {
    const operator: string = action.charAt(0);
    let newValue: number = state.value;

    switch (operator) {
        case "u":
            const lastAction: string | undefined = state.history.pop();
            if (lastAction !== undefined) {
                const actionToDo: string = reverseAction(lastAction.split(" ")[0])
                newValue = evaluateOperation(state.value, actionToDo)
                state.undo_history.push(`${actionToDo} (${state.value} -> ${newValue})`)
            }
            break;
        case "r":
            const lastUndoneAction: string | undefined = state.undo_history.pop();
            if (lastUndoneAction !== undefined) {
                const actionToRedo: string = reverseAction(lastUndoneAction.split(" ")[0])
                newValue = evaluateOperation(state.value, actionToRedo)
                state.history.push(`${actionToRedo} (${state.value} -> ${newValue})`)
            }
            break;
        default:
            newValue = evaluateOperation(state.value, action);
            state.history.push(`${action} (${state.value} -> ${newValue})`);
    }

    return {
        value: newValue,
        history: state.history,
        undo_history: state.undo_history
    }
}

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const buttons: string[] = ['-100', '-10', '-1', '+1', '+10', '+100']

    return (
        <>
            <div>
                <h2>{state.value}</h2>
            </div>

            <div>
                {buttons.map((amount) => {
                    return <button onClick={() => {dispatch(amount)}}>{amount}</button>
                })}
            </div>

            <div>
                <button onClick={() => {
                    dispatch('undo')
                }}>Undo
                </button>

                <button onClick={() => {
                    dispatch('redo')
                }}>Redo
                </button>
            </div>

            <div>
                <p>History:</p>
                <ol>
                    {state.history.map((entry, index) => {
                        return <li key={index}>{entry}</li>
                    })}
                </ol>
            </div>
        </>
    )
}

export default App;
