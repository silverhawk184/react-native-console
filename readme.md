# React Native Console View

No longer do you need to connect your android device to your computer and use `adb logcat | grep "search term"` or fire up xcode just to debug your app. Now you can view all those log messages within your app. Great for non-technical users such as QA to make sure something is happening in the background.

Usage: 
**App.tsx**

    import React, { Component } from 'react';
    import { ConsoleView, initConsoleView } from 'react-native-console-view';
    
    export default class App extends Component<AppProps> {
        constructor(props: AppProps) {
            super(props);
        }
        componentWillMount() {
            initConsoleView();
        }
        render {
            return (
                <Provider store={store}>
                    ... app stuff ...
                    <ConsoleView enabled={true} breakpoint="mobile" />
                </Provider>
            );
        }
    }


**From then on**

    import { console } from 'react-native-console-view'; // or for backwards compatibility, you can use `consoleView`
    console.log('big alert', 'lots of details');

### Just like your favorite JavaScript console, this supports:
- `console.[log|warn|error](label, message, style?)`
- `console.[time|timeEnd](label, style?)`
- `console.logOnChange(label, message, style?)` - logs when message is different or new, otherwise logs a semi-transparent "no change" statement

### On Screen Features:
- Show and hide the console
- Toggle the console's action bar to be fixed to the top or bottom of the screen
- Toggle between scrolling the log's contents or touching through the log window and scrolling the app's screen
- Copying the log to the clipboard for sharing
- Clear the log history

### Examples

    console.log('User Logged In'); // displays `User Logged In:` in a white font

    console.log('Push Notification - Processed', message); // displays `Push Notification - Processed:` and pretty prints {message} in a white font

    console.log('Analytics', {name: 'navigation', link: '/home'}, {color: '#FFFF00'}); // displays `Response: invalid data` in a red font

    console.logOnChange('Location Updated', {lat: 1, lon: 2}); // displays `Location Updated: {lat: 1, lon: 2}` in a pretty printed format
    console.logOnChange('Location Updated', {lat: 1, lon: 1}); // displays `Location Updated:  no change` in a slightly transparent font
    console.logOnChange('Location Updated', {lat: 8, lon: 9}); // displays `Location Updated: {lat: 8, lon: 9}` in a pretty printed format
    console.logOnChange('Location Updated', {lat: 8, lon: 9}); // displays `Location Updated: no change` in a slightly transparent font

    console.error('Response', 'invalid data'); // displays `Response: invalid data` in a red font

### Other
And best of all, no extra dependencies!
