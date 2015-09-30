import {SELECT, MULTISELECT} from 'd2-ui-basicfields/fields';
import {getInstance as getD2} from 'd2';

const organisationUnitLevelsPromise = getD2()
    .then(d2 => d2.models.organisationUnitLevel.list());

const organisationUnitLevelsMapPromise = organisationUnitLevelsPromise
    .then(collection => {
        return new Map(collection
            .toArray()
            .map(value => {
                return [value.level, value.name];
            }));
    });

export default new Map([
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
                'max',
            ],
        },
    }],
    ['aggregationLevels', {
        type: MULTISELECT,
        source() {
            return organisationUnitLevelsPromise
                .then(collection => {
                    return collection.toArray()
                        .map(item => {
                            return {
                                name: item.name,
                                id: item.level,
                            };
                        });
                });
        },
        fromModelTransformer(modelValue) {
            return organisationUnitLevelsMapPromise
                .then(organisationUnitLevelsMap => {
                    if (organisationUnitLevelsMap.has(modelValue)) {
                        return {
                            name: organisationUnitLevelsMap.get(modelValue),
                            id: modelValue,
                        };
                    }
                });
        },
        toModelTransformer(object) {
            return parseInt(object.id, 10);
        },
    }],
]);
