import { View, TextStyle } from 'react-native';
import Console, { ConsoleMessages } from './console.component';
import { PureComponent } from 'react';
import React from 'react';

const globalAny: {
    consoleView: {
        messages: ConsoleMessages,
        enabled: boolean,
        ref: Console|null,
        timers: {[key: string]: {startTime: number, style: TextStyle}},
        logOnChangeHistory: {[key: string]: string},
    },
} = global as any;

export const initConsoleView = () => {
    globalAny.consoleView = {
        messages: [],
        enabled: false,
        ref: null,
        timers: {},
        logOnChangeHistory: {},
    };
};

interface ConsoleViewProps {
    enabled: boolean;
    breakpoint: 'mobile'|'tablet';
}
export class ConsoleView extends PureComponent<ConsoleViewProps> {
    render() {
        if (typeof globalAny.consoleView === 'undefined' || typeof globalAny.consoleView.messages === 'undefined')
            return null;
        const {enabled, breakpoint} = this.props;
        globalAny.consoleView.enabled = enabled;
        const messages = globalAny.consoleView.messages;
        return (
            <Console
                enabled = {enabled}
                breakpoint = {breakpoint}
                messages={messages}
                ref={this.handleRef}
                clear={this.handleClear}
                showMessagePayload={this.handleShowMessagePayload}
            />
        );
    }
    handleRef = (e: Console|null) => {globalAny.consoleView.ref = e; };
    handleClear = () => {
        while (globalAny.consoleView.messages.length > 0)
            globalAny.consoleView.messages.pop();
        setTimeout(() => {
            globalAny.consoleView.ref!.forceUpdate();
        }, 100);
    }
    handleShowMessagePayload = (i: number) => {
        globalAny.consoleView.messages[i].message = globalAny.consoleView.messages[i].messagePayload as string;
        delete globalAny.consoleView.messages[i].messagePayload;
        setTimeout(() => {
            globalAny.consoleView.ref!.forceUpdate();
        }, 100);
    }

}

export const console = {
    log: (label: string, message?: string|object) => {
        console.append(label, message, {color: '#FFFFFF'});
    },
    warn: (label: string, message?: string|object) => {
        console.append(label, message, {color: '#FFFF00'});
    },
    error: (label: string, message?: string|object) => {
        console.append(label, message, {color: '#FF0000'});
    },
    append: (label: string, message: string|object = '', style: TextStyle = {color: '#FFFFFF'}) => {
        if (!globalAny.consoleView.enabled || !globalAny.consoleView.ref) return;
        let messagePayload;
        if (typeof message === 'object'){
            messagePayload = JSON.stringify(message, getCircularReplacer(), 2);
            message = '';
        }
        globalAny.consoleView.messages.push({label, message, messagePayload, style, timestamp: new Date()});
        globalAny.consoleView.ref.forceUpdate();
    },
    time: (label: string, style: TextStyle = {}) => {
        if (!globalAny.consoleView.enabled) return;
        globalAny.consoleView.timers[label] = {startTime: Date.now(), style};
    },
    timeEnd: (label: string) => {
        if (!globalAny.consoleView.timers[label]) return;
        const {startTime, style}  = globalAny.consoleView.timers[label];
        const curTime = Date.now();
        console.append(label, `${curTime - startTime}ms - timer ended`, {color: '#00FF00', ...style});
        delete globalAny.consoleView.timers[label];
    },
    timeLog: (label: string) => {
        if (typeof globalAny.consoleView.timers[label] === 'undefined') return;
        const {startTime, style}  = globalAny.consoleView.timers[label];
        const curTime = Date.now();
        console.append(label, `${curTime - startTime}ms`, {color: '#00FF00', ...style});
    },
    logOnChange: (label: string, message: string|object, style: TextStyle) => {
        const testMessage = (typeof message === 'object') ? JSON.stringify(message) : message;
        style = {color: '#FF00FF', ...style};
        if (
            typeof globalAny.consoleView.logOnChangeHistory[label] === 'undefined' ||
            globalAny.consoleView.logOnChangeHistory[label] !== testMessage
        ) console.append(label, message, style);
        else {
            if (style.color!.length === 7) style.color += '55'; //slightly transparent
            console.append(label, 'no change', {fontStyle: 'italic', ...style});
        }
        globalAny.consoleView.logOnChangeHistory[label] = testMessage;
    },
};
export const consoleView = console;

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };