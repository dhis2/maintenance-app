import Translate from '../Translate.mixin';

describe('Translate mixin', () => {
    beforeEach(() => {
        Translate.context = {
            d2: {
                i18n: {
                    getTranslation: jest.fn().mockReturnValue('Navn'),
                },
            },
        };
    });

    it('should have a getTranslation method', () => {
        expect(typeof Translate.getTranslation).toBe('function');
    });

    it('should define d2 on the context', () => {
        expect(Translate.contextTypes.d2).not.toBe(undefined);
    });

    it('should call the d2 translation service for the translation', () => {
        Translate.getTranslation('name');

        expect(Translate.context.d2.i18n.getTranslation).toHaveBeenCalledWith('name');
    });

    it('should pass the ', () => {
        expect(Translate.getTranslation('name')).toBe('Navn');
    });
});
