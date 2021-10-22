import BaseStoreNamespace from '../../datastore/BaseStoreNamespace';

describe('BaseStoreNamespace', () => {
    describe('constructor()', () => {
        it('it should throw if created with new() directly', () => {
            expect(() => new BaseStoreNamespace('namespace', null, null, 'endpoint'))
                .toThrow(/Can't instantiate abstract class/);
        });

        it('it should throw if not created with an endpoint', () => {
            expect(() => new BaseStoreNamespace('namespace', null, null, null))
                .toThrow(/must be called with an endPoint/);
        });

        it('it should throw if endpoint is not a string', () => {
            expect(() => new BaseStoreNamespace('namespace', null, null, {}))
                .toThrow(/must be called with an endPoint/);
        });
    });
});
