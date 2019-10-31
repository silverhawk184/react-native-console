import { PureComponent } from 'react';
import { View, ScrollView, Text, TextInput, Button, StatusBar, Clipboard, Share, SafeAreaView } from 'react-native';
import React from 'react';
import { consoleStyles } from './console.styles';

interface ConsoleMessage {
    style: object;
    label: string;
    message: string;
    messagePayload?: string;
    timestamp: Date;
}

export type ConsoleMessages = ConsoleMessage[];

interface ConsoleProps{
    messages: ConsoleMessages;
    breakpoint: 'mobile'|'tablet';
    enabled: boolean;
    clear(): void;
    showMessagePayload(i: number): void;
}

interface ConsoleState {
    filter: string;
    visible: boolean;
    barPosition: 'top'|'bottom';
    scrollEnabled: boolean;
}

export default class Console extends PureComponent<ConsoleProps, ConsoleState> {
    static defaultProps: Partial<ConsoleProps> = {
        breakpoint: 'mobile',
        enabled: false,
    };

    logRef: ScrollView|null = null;

    constructor(props: ConsoleProps) {
        super(props);
        this.state = {
            filter: '',
            visible: true,
            barPosition: 'bottom',
            scrollEnabled: false,
         };
    }
    render() {
        const {breakpoint, clear, enabled } = this.props;
        const {visible, barPosition, scrollEnabled } = this.state;
        const {container, actionBar, actionBarInput, logContainer } = consoleStyles.mobile;
        if (!enabled) return null;
        return (
            <SafeAreaView
                pointerEvents='box-none'
                style={[
                    container,
                    {
                        flexDirection: barPosition === 'top' ? 'column' : 'column-reverse',
                        paddingTop: StatusBar.currentHeight,
                    },
                ]}
            >
                <View style={actionBar} pointerEvents='auto'>
                    <Button onPress={this.toggleShow} title={visible && barPosition ? '\u22A5' : '\u22A4'} color='#28a745' />
                    <Button onPress={this.togglePosition} title={barPosition === 'bottom' ? '\u25BD' : '\u25B3'} color='#dc3545' />
                    <Button onPress={this.toggleScroll} title={scrollEnabled ? '\u2226' : '\u21C5'} color='#ffc108' />
                    <Button onPress={this.handleClipboard} title={'\u2398'} color='#6c757d' />
                    <Button onPress={clear} title='_' color='#17a2b8' />
                    <TextInput onChangeText={this.updateFilter} style={actionBarInput} />
                </View>
                {scrollEnabled ? ( /* {scrollEnabled ? 'auto' : 'none'} doesn't work on ScrollView */
                    <ScrollView
                        style={[logContainer, {display: visible ? 'flex' : 'none'}]}
                        ref={ref => this.logRef = ref}
                        onContentSizeChange={this.handleLogSizeChange}
                    >
                        {this.renderMessages()}
                    </ScrollView>
                ) : (
                    <View
                        pointerEvents='none'
                        style={[logContainer, {display: visible ? 'flex' : 'none', overflow: 'hidden'}]}
                    >
                        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
                            {this.renderMessages()}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
    renderMessages = () => {
        const filter = this.state.filter;
        return this.props.messages.map((e: ConsoleMessage, i) => {
            if (filter !== '' && (e.label + ': ' + e.message).toLowerCase().indexOf( filter.toLowerCase()) < 0)
                return null;
            if (e.messagePayload)
                e.message = (<Text onPress={() => {this.props.showMessagePayload(i); }}>( Click to view payload )</Text>) as any as string;
            const timestamp = `${e.timestamp.getHours().toString().padStart(2, '0')}:${e.timestamp.getMinutes().toString().padStart(2, '0')}:${e.timestamp.getSeconds().toString().padStart(2, '0')}`;
            return <Text style={e.style}>{timestamp} <Text style={{fontWeight: 'bold'}}>{e.label}:</Text> {e.message}</Text>;
        });
    }
    toggleShow = () => {
        this.setState({visible: !this.state.visible});
    }
    togglePosition = () => {
        this.setState({barPosition: this.state.barPosition === 'bottom' ? 'top' : 'bottom'});
    }
    toggleScroll = () => {
        this.setState({scrollEnabled: !this.state.scrollEnabled});
    }
    updateFilter = (filter: string) => {
        this.setState({filter});
    }
    handleLogSizeChange = () => {
        this.logRef!.scrollToEnd({animated: true});
    }
    handleClipboard = async () => {
        const filter = this.state.filter;
        const textLog = this.props.messages.map((e) => {
            if (filter !== '' && (e.label + ': ' + e.message).toLowerCase().indexOf( filter.toLowerCase()) < 0)
                return '';
            const message = e.messagePayload ? e.messagePayload : e.message;
            const timestamp = `${e.timestamp.getHours().toString().padStart(2, '0')}:${e.timestamp.getMinutes().toString().padStart(2, '0')}:${e.timestamp.getSeconds().toString().padStart(2, '0')}`;
            return `${timestamp} ${e.label}: ${message}\n`;
        }).join('');

        const csvLog = this.props.messages.map((e) => {
            if (filter !== '' && (e.label + ': ' + e.message).toLowerCase().indexOf( filter.toLowerCase()) < 0)
                return '';
            const timestamp = e.timestamp.toISOString();
            const label = '"' + (e.label.replace(/\"/g, '""')) + '"';
            let message = e.messagePayload ? e.messagePayload : e.message;
            message = '"' + (message.replace(/\"/g, '""')) + '"';
            return `${timestamp},${label},${message}\n`;
        }).join('');

        Clipboard.setString(textLog);
        await Share.share({
            message: textLog,
            //url: 'data:text/csv;base64,' + atob(csvLog), //TODO coming in react-native-community
        });
    }
}
