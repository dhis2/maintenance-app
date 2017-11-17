import React, { PropTypes } from 'react';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Paper from 'material-ui/Paper/Paper';
import mapPropsStream from 'recompose/mapPropsStream';
import eventProgramStore from '../../eventProgramStore';
import { get, noop, first, getOr, __ } from 'lodash/fp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import Store from 'd2-ui/lib/store/Store';
import { addAttributesToStage, removeAttributesFromStage, editProgramStageAttributes } from './actions';
import withHandlers from 'recompose/withHandlers';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import TextField from 'material-ui/TextField/TextField';
import pure from 'recompose/pure';
import withState from 'recompose/withState';

const getFirstProgramStage = compose(first, get('programStages'));

const program$ = eventProgramStore
    .map(get('program'))

const availableAttributes$ = eventProgramStore
    .map(get('availableAttributes'))
    .take(1);

const mapDispatchToProps = dispatch => bindActionCreators({
    addAttributesToStage,
    removeAttributesFromStage,
    editProgramStageAttributes,
}, dispatch);

const enhance = compose(
    mapProps(props => ({
        groupName: props.params.groupName,
        modelType: props.schema,
        modelId: props.params.modelId })
    ),
    connect(null, mapDispatchToProps),
    mapPropsStream(props$ => props$
        .combineLatest(
            program$,
            availableAttributes$,
            (props, program$, attributes) => ({ ...props, attributes, model: program$, items: program$.programTrackedEntityAttributes || [] })
        )
    ),
    withHandlers({
        onAssignItems: ({ addAttributesToStage}) => (attributes) => {
            addAttributesToStage({ attributes: attributes });
            return Promise.resolve();
        },
        onRemoveItems: ({ model, removeAttributesFromStage }) => (attributes) => {
            removeAttributesFromStage({ attributes: attributes });
            return Promise.resolve();
        },
        onEditProgramStageDataElement: ({ model, editProgramStageAttributes }) => attribute => editProgramStageAttributes({
            attribute,
        }),
    }),
    withState('attributeFilter', 'setDataElementFilter', ''),
);

const flipBooleanPropertyOn = (object, key) => ({
    ...object,
    [key]: !object[key],
});

const ProgramStageDataElement = pure(({ programStageDataElement, onEditProgramStageDataElement }) => {
    const isDateValue = programStageDataElement.dataElement.valueType === 'DATE';
    const hasOptionSet = !!programStageDataElement.dataElement.optionSet;
    const onChangeFlipBooleanForProperty = propertyName => () => onEditProgramStageDataElement(
        flipBooleanPropertyOn(programStageDataElement, propertyName)
    );
    const isCheckedForProp = getOr(false, __, programStageDataElement);

    return (
        <TableRow>
            <TableRowColumn>{programStageDataElement.dataElement.displayName}</TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isCheckedForProp('compulsory')}
                    onClick={onChangeFlipBooleanForProperty('compulsory')}
                />
            </TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isCheckedForProp('allowProvidedElsewhere')}
                    onClick={onChangeFlipBooleanForProperty('allowProvidedElsewhere')}
                />
            </TableRowColumn>
            <TableRowColumn>
                <Checkbox
                    checked={isCheckedForProp('displayInReports')}
                    checkedIcon={<Visibility />}
                    uncheckedIcon={<VisibilityOff />}
                    onClick={onChangeFlipBooleanForProperty('displayInReports')}
                />
            </TableRowColumn>
            <TableRowColumn>
                {isDateValue ? <Checkbox
                    checked={isCheckedForProp('allowFutureDate')}
                    onClick={onChangeFlipBooleanForProperty('allowFutureDate')}
                /> : null}
            </TableRowColumn>
            <TableRowColumn>
                {hasOptionSet ? <Checkbox
                    checked={isCheckedForProp('renderOptionsAsRadio')}
                    onClick={onChangeFlipBooleanForProperty('renderOptionsAsRadio')}
                /> : null}
            </TableRowColumn>
        </TableRow>
    );
});

function addDisplayProperties(dataElements) {
    console.log(dataElements)
    return ({ trackedEntityAttribute, ...other }) => {
        console.log(trackedEntityAttribute)
        const { displayName, valueType } = dataElements.find(({ id }) => id === trackedEntityAttribute.id);

        return {
            ...other,
            dataElement: {
                ...trackedEntityAttribute,
                displayName,
                valueType,
            },
        };
    };
}

function AssignAttributes(props, { d2 }) {
    const itemStore = Store.create();
    const assignedItemStore = Store.create();
    console.log(props)
    itemStore.setState(
        props.attributes.map(attribute => ({
            id: attribute.id,
            text: attribute.displayName,
            value: attribute.id,
        }))
    );


    assignedItemStore.setState(
        props.model.programTrackedEntityAttributes.map(a => a.trackedEntityAttribute.id)
    );

    //map staged items
    const tableRows = props.items
        //add
        .map(addDisplayProperties(props.attributes))
        .map((programStageDataElement, index) => (
            <ProgramStageDataElement
                key={programStageDataElement.id}
                programStageDataElement={programStageDataElement}
                onEditProgramStageDataElement={props.onEditProgramStageDataElement}
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
                        <TableHeaderColumn>Date in future</TableHeaderColumn>
                        <TableHeaderColumn>Render options as radio</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tableRows}
                </TableBody>
            </Table>
        </Paper>
    );
}

AssignAttributes.contextTypes = {
    d2: PropTypes.object,
};

export default enhance(AssignAttributes);
