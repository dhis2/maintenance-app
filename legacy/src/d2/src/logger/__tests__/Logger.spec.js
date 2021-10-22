import Logger from '../Logger';

describe('Logger', () => {
    let logger;
    let consoleMock;

    beforeEach(() => {
        consoleMock = {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
        };

        logger = new Logger(consoleMock);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Logger()).toThrowError('Cannot call a class as a function');
    });

    it('should get the correct Logger instance from the namespace', () => {
        expect(logger).toBeInstanceOf(Logger);
    });

    it('should have a log function', () => {
        expect(logger.log).toBeDefined();
        expect(logger.log).toBeInstanceOf(Function);
    });

    it('should log to the console', () => {
        logger.log('my message');

        expect(consoleMock.log).toBeCalledWith('my message');
    });

    it('should return true after successful logging', () => {
        expect(logger.log('my message')).toBe(true);
    });

    it('should not log when it does not exist', () => {
        delete consoleMock.log;

        expect(logger.log('my message')).toBe(false);
    });

    it('should not log if the method does not exist', () => {
        delete consoleMock.warn;

        expect(logger.warn('my message')).toBe(false);
    });

    it('should log a warning', () => {
        expect(logger.warn('my message')).toBe(true);
        expect(consoleMock.warn).toBeCalledWith('my message');
    });

    it('should log a debug request', () => {
        expect(logger.debug('my message')).toBe(true);
        expect(consoleMock.debug).toBeCalledWith('my message');
    });

    it('should not log when it does not exist', () => {
        delete consoleMock.debug;

        expect(logger.debug('my message')).toBe(false);
    });

    it('should log an error request', () => {
        expect(logger.error('my message')).toBe(true);
        expect(consoleMock.error).toBeCalledWith('my message');
    });

    it('should not log when error does not exist', () => {
        delete consoleMock.error;

        expect(logger.error('my message')).toBe(false);
    });

    describe('getLogger', () => {
        it('should return a logger', () => {
            expect(Logger.getLogger()).toBeInstanceOf(Logger);
        });

        it('should create a singleton and return that', () => {
            expect(Logger.getLogger()).toBe(Logger.getLogger());
        });
    });
});
