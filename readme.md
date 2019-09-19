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

### Examples

    console.log('User Logged In');

    console.log('Push Notification - Processed', message);

    console.log('Analytics', {name: 'navigation', link: '/home'}, {color: '#FFFF00'});

    console.logOnChange('Location Updated', {lat: latitude, lon: longitude});
    console.logOnChange('Location Updated', {lat: latitude, lon: longitude});
    console.logOnChange('Location Updated', {lat: latitude+2, lon: longitude});
    console.logOnChange('Location Updated', {lat: latitude+2, lon: longitude});

    console.error('Response', 'invalid data');