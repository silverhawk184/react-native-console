import { combineReducers, compose, createStore } from 'redux';
import { debugConsoleReducer, DebugConsoleState } from './console.reducer';

export interface RootState {
    debuggerConsole?: DebugConsoleState;
}

const rootReducer = combineReducers({
  debuggerConsole: debugConsoleReducer,
});

export const store = createStore(
    rootReducer,
    {},
    compose(),
);
