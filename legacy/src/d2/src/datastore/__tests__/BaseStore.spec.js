import BaseStore from '../../datastore/BaseStore';

describe('BaseStore', () => {
    describe('constructor()', () => {
        it('it should throw if created with new() directly', () => {
            expect(() => new BaseStore()).toThrow();
        });

        it('it should throw if not created with a subclass', () => {
            class AnotherClass extends BaseStore {
                constructor() {
                    super(null, 'endpoint', String);
                }
            }
            expect(() => new AnotherClass()).toThrow(/must be subclass/);
        });
    });
});
