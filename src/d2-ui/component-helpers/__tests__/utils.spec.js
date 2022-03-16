import { createClassName } from '../utils';

describe('utils/createClassName', () => {
    it('should return the same class name', () => {
        expect(createClassName('my-component')).toBe('my-component');
    });

    it('should return class name and class name with selector appended', () => {
        expect(createClassName('my-component', 'abc')).toBe('my-component my-component-abc');
    });
});
