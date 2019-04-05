import { featureTypeOverride } from './program';

export default new Map([
    [
        'validationStrategy',
        {
            required: true,
            defaultValue: 'ON_UPDATE_AND_INSERT',
        },
    ],
    [
        'featureType',
        {
            fieldOptions: {
                options: featureTypeOverride,
            },
        },
    ],
]);
