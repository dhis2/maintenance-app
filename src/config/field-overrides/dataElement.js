import {SELECT, MULTISELECT} from 'd2-ui-basicfields/fields';
import d2 from '../../utils/d2';

export default new Map([
    ['type', {
        type: SELECT,
        templateOptions: {
            options: [
                'int',
                'string',
                'bool',
                'trueOnly',
                'date',
                'username'
            ]
        }
    }],
    ['aggregationOperator', {
        type: SELECT,
        templateOptions: {
            options: [
                'sum',
                'average',
                'avg',
                'count',
                'stddev',
                'variance',
                'min',
                'max'
            ]
        },
        hide: model => (['bool', 'trueOnly', 'int'].indexOf(model.type)) === -1
    }],
    ['numberType', {
        type: SELECT,
        templateOptions: {
            options: [
                'number',
                'int',
                'posInt',
                'negInt',
                'zeroPositiveInt',
                'unitInterval',
                'percentage'
            ]
        },
        hide: (model) => model.type !== 'int'
    }],
    ['textType', {
        type: SELECT,
        templateOptions: {
            options: [
                'text',
                'longText'
            ]
        },
        hide: (model) => model.type !== 'string'
    }],
    ['aggregationLevels', {
        type: MULTISELECT,
        source() {
            return d2.then(d2 => {
                return d2.models.organisationUnitLevel.list()
                    .then(collection => {
                        return collection.toArray()
                            .map(item => {
                                return {
                                    name: item.name,
                                    id: item.level
                                };
                            });
                    });
            });
        },
        fromModelTransformer(modelValue) {
            console.log(modelValue);
            return {
                id: modelValue
            };
        },
        toModelTransformer(object) {
            return parseInt(object.id, 10);
        },
    }],
]);
