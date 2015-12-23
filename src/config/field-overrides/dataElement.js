import {MULTISELECT} from '../../forms/fields';
import {config, getInstance as getD2} from 'd2/lib/d2';

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
    ['aggregationLevels', {
        referenceType: 'organisationUnitLevel',
        fieldOptions: {},
        //beforeUpdateConverter(object) {
        //    return parseInt(object.id, 10);
        //},
    }],
]);
