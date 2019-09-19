# React Native Console View

Shows logged console messages in a View

Usage: 
**App.tsx**

    import React, { Component } from 'react';
    import ConsoleLog from 'react-native-console-view';
    export default class App extends Component<AppProps> {
    constructor(props: AppProps) {
        super(props);
    }

    render {
        return (
        <Provider store={store}>
            ... app stuff ...
            <ConsoleLog enabled={this.showLog} breakpoint="mobile" />
        </Provider>
        );
    }
    }


**From then on**

    import { console } from 'react-native-console-view';
    console.log('big alert', 'lots of details');

### Just like your favorite JavaScript console, this supports:
- console.[log|warn|error](label, message, style)
- console.[time|timeEnd](label)
- console.logOnChange(label, message) - logs when message is different or new, otherwise logs a semi-transparent "no change" statement
