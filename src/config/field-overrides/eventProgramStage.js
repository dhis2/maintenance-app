import { featureTypeOverride } from './program';

export default new Map([
    [
        'validationStrategy',
        {
            required: true,
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
