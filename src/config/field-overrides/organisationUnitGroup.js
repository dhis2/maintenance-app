import IconPicker from '../../forms/form-fields/icon-picker';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';

export default new Map([
    ['symbol', {
        component: IconPicker,
        fieldOptions: {
            options: (function () {
                const symbolUrls = [];
                let i = 1;

                for (; i <= 40; i++) {
                    const filename = i > 9 ? i : `0${i}`;
                    symbolUrls.push(`${filename}.${i > 25 ? 'svg' : 'png'}`);
                }

                return symbolUrls;
            }()),
            imgPath: (process.env.NODE_ENV !== 'production') ? 'http://localhost:8080/dhis/images/orgunitgroup' : '/images/orgunitgroup',
        },
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
]);
