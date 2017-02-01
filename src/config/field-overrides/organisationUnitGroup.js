import React from 'react';
import IconPicker from '../../forms/form-fields/icon-picker';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';

class SymbolPickerField extends React.Component {
    constructor(props, context) {
        super(props, context);

        const apiBaseUrl = context.d2.Api.getApi().baseUrl;
        const baseUrl = apiBaseUrl.substr(0, apiBaseUrl.lastIndexOf('/api'));
        this.baseUrl = `${baseUrl}/images/orgunitgroup`;
    }

    render() {
        return (
            <IconPicker
                {...this.props}
                imgPath={this.baseUrl}
            />
        );
    }
}
SymbolPickerField.contextTypes = { d2: React.PropTypes.object };

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
