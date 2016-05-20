import React from 'react';
import LinearProgress from 'material-ui/lib/circular-progress';
import IconPicker from '../../forms/form-fields/icon-picker';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import { getManifest } from 'd2/lib/d2';

class SymbolPickerField extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {};
    }

    componentDidMount() {
        getManifest('./manifest.webapp')
            .then(manifest => {
                this.setState({
                    baseUrl: (process.env.NODE_ENV === 'production') ? manifest.getBaseUrl() + '/images/orgunitgroup' : 'http://localhost:8080/dhis/images/orgunitgroup',
                });
            });
    }

    render() {
        if (!this.state.baseUrl) {
            return (<LinearProgress indeterminate/>);
        }
        return (
            <IconPicker
                {...this.props}
                imgPath={this.state.baseUrl}
            />
        );
    }
}

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
