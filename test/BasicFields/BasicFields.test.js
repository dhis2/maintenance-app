import basicFields from '../src/index';

describe('BasicFields', () => {
    it('should contain the Input component', () => {
        expect(basicFields.Input).not.to.be.undefined;
    });

    it('should contain the Textarea component', () => {
        expect(basicFields.Textarea).not.to.be.undefined;
    });
});
