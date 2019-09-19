import { connect } from 'react-redux';
import ConsoleComponent from './console.component';
import { consoleSelector } from './console.selectors';
import { DebugConsoleClearMessages } from './console.reducer';

const mapStateToProps = consoleSelector;

const mapDispatchToProps = (dispatch: any) => {
    return {
        clear: () => {
            dispatch(DebugConsoleClearMessages());
        },
    };
};

export const ConsoleLog = connect(mapStateToProps, mapDispatchToProps)(ConsoleComponent);
