import React from 'react';
import PropTypes from 'prop-types';
import { get, getOr, __ } from 'lodash/fp';

import compose from 'recompose/compose';

import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';

import Paper from 'material-ui/Paper/Paper';
import TextField from 'material-ui/TextField/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import TETAttributeRow from '../../../forms/form-fields/attribute-row';

function addDisplayProperties(attributes) {
    return ({ trackedEntityTypeAttribute, ...other }) => {
        const { displayName, valueType, optionSet, unique } = attributes.find(({ id }) => id === trackedEntityTypeAttribute.id);
        return {
            ...other,
            trackedEntityTypeAttribute: {
                ...trackedEntityTypeAttribute,
                displayName,
                valueType,
                optionSet,
                unique,
            },
        };
    };
}

function AssignTrackedEntityTypeAttributes(props, { d2 }) {
    const isLoading = true;
    d2.models.trackedEntityAttribute.list({
        level: 1,
        paging: false,
        fields: ['id,displayName,valueType,unique,optionSet'].join(','),
    }).then(pung => console.log(pung.toArray()));

    if (isLoading) {
        return null;
    }

    const itemStore = Store.create();
    const assignedItemStore = Store.create();
    itemStore.setState(
        props.availableAttributes.map(attribute => ({
            id: attribute.id,
            text: attribute.displayName,
            value: attribute.id,
        })),
    );

    // Assign existing attributes
    assignedItemStore.setState(
        props.items.map(a => a.trackedEntityAttribute.id),
    );

    // Create edit-able rows for assigned attributes
    const tableRows = props.items
        .map(addDisplayProperties(props.availableAttributes))
        .map(trackedEntityType => (
            <TETAttributeRow
                key={trackedEntityType.id}
                displayName={trackedEntityType.trackedEntityTypeAttribute.displayName}
                attribute={trackedEntityType}
                onEditAttribute={props.onEditProgramAttribute}
                isDateValue={trackedEntityType.trackedEntityAttribute.valueType === 'DATE'}
                isUnique={trackedEntityType.trackedEntityTypeAttribute.unique}
                hasOptionSet={!!trackedEntityType.trackedEntityTypeAttribute.optionSet}
            />
        ));

    return (
        <Paper>
            <div style={{ padding: '2rem 3rem 4rem' }}>
                <TextField
                    hintText={d2.i18n.getTranslation('search_available_selected_items')}
                    onChange={compose(props.attributeFilter, getOr('', 'target.value'))}
                    value={props.attributeFilter}
                    fullWidth
                />
                <GroupEditor
                    itemStore={itemStore}
                    assignedItemStore={assignedItemStore}
                    height={250}
                    filterText={props.attributeFilter}
                    onAssignItems={props.onAssignItems}
                    onRemoveItems={props.onRemoveItems}
                />
            </div>
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Display in list</TableHeaderColumn>
                        <TableHeaderColumn>Mandatory</TableHeaderColumn>
                        <TableHeaderColumn>Date in future</TableHeaderColumn>
                        <TableHeaderColumn>Render options as radio</TableHeaderColumn>
                        <TableHeaderColumn>Searchable</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tableRows}
                </TableBody>
            </Table>
        </Paper>
    );
}

AssignTrackedEntityTypeAttributes.propTypes = {
    availableAttributes: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onEditProgramAttribute: PropTypes.func.isRequired,
    attributeFilter: PropTypes.string.isRequired,
    onAssignItems: PropTypes.func.isRequired,
    onRemoveItems: PropTypes.func.isRequired,
};

AssignTrackedEntityTypeAttributes.contextTypes = {
    d2: PropTypes.object,
};

export default AssignTrackedEntityTypeAttributes;
