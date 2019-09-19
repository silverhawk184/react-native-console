import { createStructuredSelector, createSelector } from 'reselect';
import { ConsoleStructuredProps } from './console.component';
import { get } from 'lodash';
import { RootState } from './console.redux';

const debuggerConsoleMessagesState = (rootState: RootState) => {
  return (rootState.debuggerConsole) ? rootState.debuggerConsole : [];
};

const debuggerConsoleMessagesSelector = createSelector([ debuggerConsoleMessagesState ], (debuggerConsoleMessagesState2) => {
  return get(debuggerConsoleMessagesState2, 'messages', []);
});

const debuggerConsoleMessageCountSelector = createSelector([ debuggerConsoleMessagesState ], (debuggerConsoleMessagesState2) => {
  return get(debuggerConsoleMessagesState2, 'messageCount', []);
});

export const consoleSelector = createStructuredSelector<RootState, ConsoleStructuredProps>({
  messages: debuggerConsoleMessagesSelector,
  messageCount: debuggerConsoleMessageCountSelector,
});
