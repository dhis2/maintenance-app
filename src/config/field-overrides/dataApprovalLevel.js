import { getInstance } from 'd2/lib/d2';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DropDownAsyncGetter from '../../forms/form-fields/drop-down-async-getter';

async function getOrgUnitLevels(model, d2) {
    const list = await d2.models.organisationUnitLevels.list({
        order: 'level:asc',
    });

    return list.toArray().map(level => ({
        text: level.displayName,
        value: level.level,
    }));
}

export default new Map([
    ['name', {
        fieldOptions: {
            disabled: true,
        },
    }],
    ['orgUnitLevel', {
        component: DropDownAsyncGetter,
        persisted: true,
        fieldOptions: {
            getter: getOrgUnitLevels,
        },
        validators: [{
            validator: (value) => false,
            message: 'not valid lol',
        }],
    }],
]);
