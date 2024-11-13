import React from 'react';
import AutoComplete from 'material-ui/AutoComplete/AutoComplete';
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import noop from 'd2-utilizr/lib/noop';

function findMinimumRootUnits(units,skipDeduplication) {
    if (skipDeduplication) {
        return units
    }
    // first sort the units by level, so lowest level comes first
    const sorted = units.sort((a, b) => a.level - b.level)

    const minimumRoots = sorted.filter((ou, index, array) => {
        // since the array is sorted by level we can just check the previous units,
        // because we want to get the "minimum" level
        const previousUnits = array.slice(0, index)
        // if a previous unit has a path that is a prefix of the current path,
        // then the current path is a child and should not be included
        return !previousUnits.some((pu) => ou.path.startsWith(pu.path))
    })

    return minimumRoots
}

function OrganisationUnitTreeWithSingleSelectionAndSearch(props, context) {
    const styles = {
        labelStyle: {
            whiteSpace: 'nowrap',
        },
        noHitsLabel: {
            fontStyle: 'italic',
            color: 'rgba(0, 0, 0, 0.4)',
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
            {Array.isArray(props.roots) && props.roots.length > 0 ? findMinimumRootUnits(props.roots,props.searchHitsUsed)
                .map(root =>
                {
                    return (
                        <OrganisationUnitTree
                            key={root.id}
                            root={root}
                            selected={props.selected}
                            initiallyExpanded={props.initiallyExpanded}
                            labelStyle={styles.labelStyle}
                            onSelectClick={props.onSelectClick}
                            idsThatShouldBeReloaded={props.idsThatShouldBeReloaded}
                            hideCheckboxes={props.hideCheckboxes}
                            hideMemberCount={props.hideMemberCount}
                            forceReloadChildren={props.forceReloadChildren}
                        />
                    )
                }) : <div style={styles.noHitsLabel}>{props.noHitsLabel}</div>}
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
    onSelectClick: React.PropTypes.func,
    noHitsLabel: React.PropTypes.string.isRequired,
    hideMemberCount: React.PropTypes.bool,
    hideCheckboxes: React.PropTypes.bool,
    searchHitsUsed: React.PropTypes.bool,
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
    hideMemberCount: false,
    hideCheckboxes: false,
    searchHitsUsed: false,
};

export default addD2Context(OrganisationUnitTreeWithSingleSelectionAndSearch);
