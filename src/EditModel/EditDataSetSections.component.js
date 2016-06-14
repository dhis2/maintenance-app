import React from 'react';

import DropDown from '../forms/form-fields/drop-down';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import { goBack } from '../router';

class EditDataSetSections extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categoryCombos: null,
            categoryCombo: null,
        };

        Promise.all([
            context.d2.models.dataSet.get(
                props.params.modelId, {
                    fields: [
                        'id,displayName',
                        'sections[id,displayName,sortOrder',
                        // TODO: Greyed fields are special (don't have ID)
                        // 'greyedFields[categoryOptionCombo[id],dataElement[id]]]',
                    ].join(','),
                    paging: false,
                }
            ),
            context.d2.Api.getApi().get(
                ['dataSets', props.params.modelId, 'categoryCombos'].join('/'),
                { fields: 'id,displayName', paging: false }
            ),
        ]).then(([
            dataSet,
            catComboList,
        ]) => {
            console.group('Sections:');
            dataSet.sections.toArray().forEach(s => {
                console.info(s.id, s.sortOrder, s.displayName);
            });
            console.groupEnd();
            this.setState({
                dataSet,
                categoryCombos: catComboList.categoryCombos.map(cc => ({ value: cc.id, text: cc.displayName })),
            });
        });
    }

    render() {
        return this.state.dataSet ?
            <DropDown
                options={this.state.categoryCombos}
                labelText="Category combos"
                onChange={(cc) => { console.info(cc.target.value); this.setState({ categoryCombo: cc.target.value }); }}
                defaultValue={this.state.categoryCombo}
                isRequired
            /> :
            <LoadingMask />;
    }
}

EditDataSetSections.propTypes = {
    params: React.PropTypes.any.isRequired,
};
EditDataSetSections.contextTypes = {
    d2: React.PropTypes.any.isRequired,
};

export default EditDataSetSections;
