import { SELECT } from '../../forms/fields';

export default new Map([
    ['decimals', {
        type: SELECT,
        fieldOptions: {
            options: [0, 1, 2, 3, 4, 5],
        },
        beforeUpdateConverter(value) {
            return Number(value);
        },
        beforePassToFieldConverter(value) {
            return value.toString();
        },
    }],
]);
