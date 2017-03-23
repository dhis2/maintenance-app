import reducer from './reducers';

describe('Event Program reducer', () => {
    it('should return the default state', () => {
        const expectedDefaultState = {
            step: {
                activeStep: 'details',
            },
            model: null,
        };

        expect(reducer(undefined, {})).to.deep.equal(expectedDefaultState);
    })
});
