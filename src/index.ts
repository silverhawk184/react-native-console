import {ConsoleView} from './console/console.container';
import {console, consoleView} from './console/console.reducer';

interface ConsoleViewStructuredProps {
    breakpoint?: 'mobile'|'tablet';
    enabled?: boolean;
}

export { ConsoleView as default, console, consoleView, ConsoleViewStructuredProps };
