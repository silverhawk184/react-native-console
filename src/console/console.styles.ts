import { StyleSheet, ViewStyle } from 'react-native';

// Interface to describe raw styles (some styles like flexDirection)
// do not apply to some styles like ImageStyle
interface ConsoleStyle {
    container: ViewStyle;
    actionBar: ViewStyle;
    actionBarInput: ViewStyle;
    logContainer: ViewStyle;
}

// Raw Styles for Mobile Stylesheet
const mobile: ConsoleStyle = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 99999,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 0,
        paddingHorizontal: 0,
        height: 44,
        backgroundColor: '#000000cc',
    },
    actionBarInput: {
        height: 44,
        width: '66%',
        backgroundColor: '#FFFFFF',
    },
    logContainer: {
        backgroundColor: '#000000cc',
        height: '95%',
    },
};

// Raw Styles for Tablet Stylesheet
// [NOTE]: Tablet merges mobile to make sure everything on mobile is available on tablet
const tablet: ConsoleStyle = mobile;

export const consoleStyles = {
  mobile: StyleSheet.create(mobile),
  tablet: StyleSheet.create(tablet),
};
