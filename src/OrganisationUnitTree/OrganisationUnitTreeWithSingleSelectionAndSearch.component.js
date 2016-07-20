import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import noop from 'd2-utilizr/lib/noop';

function OrganisationUnitTreeWithSingleSelectionAndSearch(props, context) {
    const styles = {
        labelStyle: {
            whiteSpace: 'nowrap',
        },
    };

    return (
        <div style={{ position: 'relative' }}>
            <AutoComplete
                hintText={context.d2.i18n.getTranslation('search')}
                onUpdateInput={props.onUpdateInput}
                onNewRequest={props.onAutoCompleteValueSelected}
                dataSource={props.autoCompleteDataSource}
                filter={AutoComplete.noFilter}
            />
            <OrganisationUnitTree
                roots={props.roots}
                selected={props.selected}
                initiallyExpanded={props.initiallyExpanded}
                labelStyle={styles.labelStyle}
                onClick={props.onClick}
                idsThatShouldBeReloaded={props.idsThatShouldBeReloaded}
            />
        </div>
    );
}
OrganisationUnitTreeWithSingleSelectionAndSearch.propTypes = {
    onOrgUnitSearch: React.PropTypes.func,
    onNewRequest: React.PropTypes.func,
    autoCompleteDataSource: React.PropTypes.array,
    onChangeSelectedOrgUnit: React.PropTypes.func,
    onAutoCompleteValueSelected: React.PropTypes.func,
    searchOrganisationUnits: React.PropTypes.func,
    roots: React.PropTypes.array,
    idsThatShouldBeReloaded: React.PropTypes.array,
    onUpdateInput: React.PropTypes.func,
    selected: React.PropTypes.array,
    initiallyExpanded: React.PropTypes.array,
    onClick: React.PropTypes.func,
};
OrganisationUnitTreeWithSingleSelectionAndSearch.defaultProps = {
    onOrgUnitSearch: noop,
    onNewRequest: noop,
    onChangeSelectedOrgUnit: noop,
    onAutoCompleteValueSelected: noop,
    searchOrganisationUnits: noop,
    onUpdateInput: noop,
    initiallyExpanded: [],
    roots: [],
    autoCompleteDataSource: [],
    idsThatShouldBeReloaded: [],
    onClick: noop,
};

export default addD2Context(OrganisationUnitTreeWithSingleSelectionAndSearch);
