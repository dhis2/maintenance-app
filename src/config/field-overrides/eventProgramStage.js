import { featureTypeOverride } from './program';

export default new Map([
    [
        'validationStrategy',
        {
            required: true,
            defaultValue: 'ON_COMPLETE',
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
