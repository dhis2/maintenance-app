import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

const noop = () => {};

function OrganisationUnitTreeWithSingleSelectionAndSearch(props, context) {
    const styles = {
        labelStyle: {
            whiteSpace: 'nowrap',
        },
    };

    return (
        <div>
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
};
OrganisationUnitTreeWithSingleSelectionAndSearch.defaultProps = {
    onOrgUnitSearch: noop,
    onNewRequest: noop,
    onChangeSelectedOrgUnit: noop,
    onAutoCompleteValueSelected: noop,
    searchOrganisationUnits: noop,
    roots: [],
    autoCompleteDataSource: [],
    idsThatShouldBeReloaded: [],
};

export default addD2Context(OrganisationUnitTreeWithSingleSelectionAndSearch);
