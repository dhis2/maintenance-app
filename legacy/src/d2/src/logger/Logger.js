/* global window */
import { checkType, isType } from '../lib/check';

class Logger {
    constructor(logging) {
        checkType(logging, 'object', 'console');
        this.logger = logging;
    }

    canLog(type) {
        return !!(type && console && isType(this.logger[type], 'function'));
    }

    logMessage(type = 'log', ...rest) {
        if (this.canLog(type) && this.logger[type]) {
            this.logger[type](...rest);
            return true;
        }
        return false;
    }

    debug(...rest) {
        return this.logMessage('debug', ...rest);
    }

    error(...rest) {
        return this.logMessage('error', ...rest);
    }

    log(...rest) {
        return this.logMessage('log', ...rest);
    }

    warn(...rest) {
        return this.logMessage('warn', ...rest);
    }

    static getLogger() {
        let logger;

        // TODO: This is not very clean try to figure out a better way to do this.
        try {
            // Node version
            logger = global.console;
        } catch (e) {
            // Browser version fallback
            /* istanbul ignore next */
            logger = window.console;
        }

        if (this.logger) {
            return this.logger;
        }
        return (this.logger = new Logger(logger));
    }
}

export default Logger;
