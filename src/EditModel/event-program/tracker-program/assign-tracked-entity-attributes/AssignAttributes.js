import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, getOr, __ } from 'lodash/fp';

import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';

import Paper from 'material-ui/Paper/Paper';
import TextField from 'material-ui/TextField/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import ProgramAttributeRow from '../../../../forms/form-fields/attribute-row';
import eventProgramStore from '../../eventProgramStore';
import { addAttributesToProgram, removeAttributesFromProgram, editProgramAttributes } from './actions';


const program$ = eventProgramStore
    .map(get('program'));

const availableAttributes$ = eventProgramStore
    .map(get('availableAttributes'))
    .take(1);

const mapDispatchToProps = dispatch => bindActionCreators({
    addAttributesToProgram,
    removeAttributesFromProgram,
    editProgramAttributes,
}, dispatch);

const enhance = compose(
    mapProps(props => ({
        groupName: props.params.groupName,
        modelType: props.schema,
        modelId: props.params.modelId }),
    ),
    connect(null, mapDispatchToProps),
    mapPropsStream(props$ => props$
        .combineLatest(
            program$,
            availableAttributes$,
            (props, program$, availableAttributes) => ({ ...props, availableAttributes, model: program$, items: program$.programTrackedEntityAttributes }),
        ),
    ),
    withHandlers({
        onAssignItems: ({ addAttributesToProgram }) => (attributes) => {
            addAttributesToProgram({ attributes });
            return Promise.resolve();
        },
        onRemoveItems: ({ removeAttributesFromProgram }) => (attributes) => {
            removeAttributesFromProgram({ attributes });
            return Promise.resolve();
        },
        onEditProgramAttribute: ({ editProgramAttributes }) => attribute => editProgramAttributes({
            attribute,
        }),
    }),
    withState('attributeFilter', 'setDataElementFilter', ''),
);

function addDisplayProperties(attributes) {
    return ({ trackedEntityAttribute, ...other }) => {
        const { displayName, valueType, optionSet, unique } = attributes.find(({ id }) => id === trackedEntityAttribute.id);
        return {
            ...other,
            trackedEntityAttribute: {
                ...trackedEntityAttribute,
                displayName,
                valueType,
                optionSet,
                unique,
            },
        };
    };
}

function AssignAttributes(props, { d2 }) {
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
        .map(programAttribute => (
            <ProgramAttributeRow
                key={programAttribute.id}
                displayName={programAttribute.trackedEntityAttribute.displayName}
                attribute={programAttribute}
                onEditAttribute={props.onEditProgramAttribute}
                isDateValue={programAttribute.trackedEntityAttribute.valueType === 'DATE'}
                isUnique={programAttribute.trackedEntityAttribute.unique}
                hasOptionSet={!!programAttribute.trackedEntityAttribute.optionSet}
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

AssignAttributes.propTypes = {
    availableAttributes: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onEditProgramAttribute: PropTypes.func.isRequired,
    attributeFilter: PropTypes.string.isRequired,
    onAssignItems: PropTypes.func.isRequired,
    onRemoveItems: PropTypes.func.isRequired,
};

AssignAttributes.contextTypes = {
    d2: PropTypes.object,
};

export default enhance(AssignAttributes);
