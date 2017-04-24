import ModelCollectionProperty from 'd2/lib/model/ModelCollectionProperty'; // FIXME: Removing this line breaks commonjs require order
import reducer from './reducers';

describe('Event Program reducer', () => {
    it('should return the default state', () => {
        const expectedDefaultState = {
            step: {
                activeStep: 'details',
            },
            stageNotifications: {
                isDeleting: false,
            },
            model: null,
        };

        expect(reducer(undefined, {})).to.deep.equal(expectedDefaultState);
    })
});
