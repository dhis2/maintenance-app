import React from 'react';
import IconPicker from '../../forms/form-fields/icon-picker';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import { getManifest } from 'd2/lib/d2';

class SymbolPickerField extends React.Component {
    constructor(props, context) {
        super(props, context);

        const baseUrl = context.d2.Api.getApi().baseUrl;
        const apiUrlSectionRegexp = /\/api(?:\/[0-9]{2})?$/;
        const systemRootFolder = baseUrl.replace(apiUrlSectionRegexp, '');

        this.imgPath = `${systemRootFolder}/images/orgunitgroup`;
    }

    render() {
        return (
            <IconPicker
                {...this.props}
                imgPath={this.imgPath}
            />
        );
    }
}
SymbolPickerField.contextTypes = { d2: React.PropTypes.any };

export default new Map([
    ['symbol', {
        component: SymbolPickerField,
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
        },
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
]);
