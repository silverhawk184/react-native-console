import { createAction, handleActions } from 'redux-actions';
import { get, clone } from 'lodash';
import { ConsoleMessages } from './console.component';
import { TextStyle } from 'react-native';
import { RootState, store } from './console.redux';

// --------------------------------
// Initial State
// --------------------------------
export class DebugConsoleState {
    messages: ConsoleMessages = [];
    messageCount: number = 0;
}

// --------------------------------
// Supported Actions
// --------------------------------
enum DebugConsoleAction {
    Log = '@@DebugConsole/LOG',
    Clear = '@@DebugConsole/CLEAR',
}

// --------------------------------
// Actions Creators
// --------------------------------
const DebugConsoleActionLog = createAction(
    DebugConsoleAction.Log,
    (label: string, message: string|object, style: TextStyle = {color: '#FFFFFF'}) => {
        if (typeof message === 'object') message = JSON.stringify(message, null, 2);
        return {label, message, style};
    },
    () => [],
);

export const DebugConsoleClearMessages = createAction(
    DebugConsoleAction.Clear,
    () => {
        return;
    },
    () => [],
);

// --------------------------------
// Actions Handlers
// --------------------------------
const DebugConsoleActionHandlers = {
    [DebugConsoleAction.Log]: (currentDebugConsoleState?: DebugConsoleState, action?: any) => {
        currentDebugConsoleState = currentDebugConsoleState || {messages: [], messageCount: 0};
        const data = get(action, 'payload');
        const newDebugConsoleState = clone(currentDebugConsoleState);
        newDebugConsoleState.messages.push(data);
        newDebugConsoleState.messageCount++;
        return newDebugConsoleState;
    },
    [DebugConsoleAction.Clear]: (currentDebugConsoleState?: DebugConsoleState, action?: any) => {
        return {messages: [], messageCount: 0};
    },
};

// --------------------------------
// Reducer
// --------------------------------
export const debugConsoleReducer = handleActions(DebugConsoleActionHandlers, new DebugConsoleState());

export const console = {
    log: (label: string, message: string|object) => {
        console.append(label, message, {color: '#FFFFFF'});
    },
    warn: (label: string, message: string|object) => {
        console.append(label, message, {color: '#FFFF00'});
    },
    error: (label: string, message: string|object) => {
        console.append(label, message, {color: '#FF0000'});
    },
    append: (label: string, message: string|object, style: TextStyle = {color: '#FFFFFF'}) => {
        const rootState = store.getState() as RootState;
        const debuggingConsole = get(rootState, 'settings.localPreference.debuggingConsole') === true;
        if (debuggingConsole)
            store.dispatch(DebugConsoleActionLog(label, message, style));
    },
    time: (label: string, style: TextStyle = {}) => {
        const rootState = store.getState() as RootState;
        const debuggingConsole = get(rootState, 'settings.localPreference.debuggingConsole') === true;
        if (debuggingConsole)
            console.timers[label] = {startTime: Date.now(), style};
    },
    timeEnd: (label: string) => {
        if (typeof console.timers[label] === 'undefined') return;
        const {startTime, style}  = console.timers[label];
        const curTime = Date.now();
        console.append(label, `${curTime - startTime}ms - timer ended`, {color: '#00FF00', ...style});
        delete console.timers[label];
    },
    timeLog: (label: string) => {
        if (typeof console.timers[label] === 'undefined') return;
        const {startTime, style}  = console.timers[label];
        const curTime = Date.now();
        console.append(label, `${curTime - startTime}ms`, {color: '#00FF00', ...style});
    },
    timers: {} as {[key: string]: {startTime: number, style: TextStyle}},
    logOnChange: (label: string, message: string|object, style: TextStyle) => {
        const testMessage = (typeof message === 'object') ? JSON.stringify(message) : message;
        style = {color: '#FF00FF', ...style};
        if (
            typeof console.logOnChangeHistory[label] === 'undefined' ||
            console.logOnChangeHistory[label] !== testMessage
        ) console.append(label, message, style);
        else {
            if (style.color!.length === 7) style.color += '55'; //slightly transparent
            console.append(label, 'no change', {fontStyle: 'italic', ...style});
        }
        console.logOnChangeHistory[label] = testMessage;
    },
    logOnChangeHistory: {} as {[key: string]: string},
};
export const consoleView = console;
