import PropTypes from 'prop-types'
import AutoComplete from 'material-ui/AutoComplete/AutoComplete';
import { OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';
import { addD2Context } from '@dhis2/d2-ui-core';
import noop from 'd2-utilizr/lib/noop';

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
            {Array.isArray(props.roots) && props.roots.length > 0 ? props.roots
                .map(root =>
                {
                    return (
                        <OrgUnitTree
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
    onOrgUnitSearch: PropTypes.func,
    onNewRequest: PropTypes.func,
    autoCompleteDataSource: PropTypes.array,
    onChangeSelectedOrgUnit: PropTypes.func,
    onAutoCompleteValueSelected: PropTypes.func,
    searchOrganisationUnits: PropTypes.func,
    roots: PropTypes.array,
    idsThatShouldBeReloaded: PropTypes.array,
    onUpdateInput: PropTypes.func,
    selected: PropTypes.array,
    initiallyExpanded: PropTypes.array,
    onSelectClick: PropTypes.func,
    noHitsLabel: PropTypes.string.isRequired,
    hideMemberCount: PropTypes.bool,
    hideCheckboxes: PropTypes.bool,
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
};

export default addD2Context(OrganisationUnitTreeWithSingleSelectionAndSearch);
