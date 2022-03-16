import * as helpers from '../';

describe('component-helpers', () => {
    it('should have addContext on the helpers object', () => {
        expect(typeof helpers.addContext).toBe('function');
    });

    it('should have addD2Context on the helpers object', () => {
        expect(typeof helpers.addD2Context).toBe('function');
    });
});
