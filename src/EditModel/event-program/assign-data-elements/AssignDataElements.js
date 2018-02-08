import React, { PropTypes } from 'react';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Paper from 'material-ui/Paper/Paper';
import mapPropsStream from 'recompose/mapPropsStream';
import programStore from '../eventProgramStore';
import { get, noop, first, getOr, __ } from 'lodash/fp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import Store from 'd2-ui/lib/store/Store';
import {
    addDataElementsToStage,
    removeDataElementsFromStage,
    editProgramStageDataElement,
} from './actions';
import withHandlers from 'recompose/withHandlers';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import TextField from 'material-ui/TextField/TextField';
import pure from 'recompose/pure';
import withState from 'recompose/withState';
import { withProgramStageFromProgramStage$ } from '../tracker-program/program-stages/utils';
import { withRouter } from 'react-router';
import { getProgramStage$ById } from '../tracker-program/program-stages/utils';

const getFirstProgramStage = compose(first, get('programStages'));

const firstProgramStage$ = programStore.map(getFirstProgramStage);

//Use programStage$ prop if present, else use first programStage
const programStage$ = props$ =>
    props$
        .take(1)
        .flatMap(
            props =>
                props.programStage$
                    ? props.programStage$
                    : programStore.map(getFirstProgramStage)
        );

const availableTrackerDataElements$ = programStore
    .map(get('availableDataElements'))
    .take(1);

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            addDataElementsToStage,
            removeDataElementsFromStage,
            editProgramStageDataElement,
        },
        dispatch
    );

const enhance = compose(
    withRouter,
    mapProps(props => ({
        ...props,
        groupName: props.params.groupName,
        modelType: props.schema,
        modelId: props.params.modelId,
    })),
    connect(null, mapDispatchToProps),
    mapPropsStream(props$ =>
        props$.combineLatest(
            programStage$(props$),
            availableTrackerDataElements$,
            (props, programStage, trackerDataElements) => ({
                ...props,
                trackerDataElements,
                model: programStage,
                items: programStage.programStageDataElements,
            })
        )
    ),
    withHandlers({
        onAssignItems: props => dataElements => {
            const { model, addDataElementsToStage } = props;
            addDataElementsToStage({ programStage: model.id, dataElements });
            return Promise.resolve();
        },
        onRemoveItems: ({
            model,
            removeDataElementsFromStage,
        }) => dataElements => {
            removeDataElementsFromStage({
                programStage: model.id,
                dataElements,
            });
            return Promise.resolve();
        },
        onEditProgramStageDataElement: ({
            model,
            editProgramStageDataElement,
        }) => programStageDataElement =>
            editProgramStageDataElement({
                programStage: model.id,
                programStageDataElement,
            }),
    }),
    withState('dataElementFilter', 'setDataElementFilter', '')
    // withProgramStageFromProgramStage$,
);

const flipBooleanPropertyOn = (object, key) => ({
    ...object,
    [key]: !object[key],
});

const ProgramStageDataElement = pure(
    ({ programStageDataElement, onEditProgramStageDataElement }) => {
        const isDateValue =
            programStageDataElement.dataElement.valueType === 'DATE';
        const hasOptionSet = !!programStageDataElement.dataElement.optionSet;
        const onChangeFlipBooleanForProperty = propertyName => () =>
            onEditProgramStageDataElement(
                flipBooleanPropertyOn(programStageDataElement, propertyName)
            );
        const isCheckedForProp = getOr(false, __, programStageDataElement);

        return (
            <TableRow>
                <TableRowColumn>
                    {programStageDataElement.dataElement.displayName}
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        checked={isCheckedForProp('compulsory')}
                        onClick={onChangeFlipBooleanForProperty('compulsory')}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        checked={isCheckedForProp('allowProvidedElsewhere')}
                        onClick={onChangeFlipBooleanForProperty(
                            'allowProvidedElsewhere'
                        )}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        checked={isCheckedForProp('displayInReports')}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff />}
                        onClick={onChangeFlipBooleanForProperty(
                            'displayInReports'
                        )}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    {isDateValue
                        ? <Checkbox
                              checked={isCheckedForProp('allowFutureDate')}
                              onClick={onChangeFlipBooleanForProperty(
                                  'allowFutureDate'
                              )}
                          />
                        : null}
                </TableRowColumn>
                <TableRowColumn>
                    {hasOptionSet
                        ? <Checkbox
                              checked={isCheckedForProp('renderOptionsAsRadio')}
                              onClick={onChangeFlipBooleanForProperty(
                                  'renderOptionsAsRadio'
                              )}
                          />
                        : null}
                </TableRowColumn>
            </TableRow>
        );
    }
);

function addDisplayProperties(dataElements) {
    return ({ dataElement, ...other }) => {
        const { displayName, valueType, optionSet } = dataElements.find(
            ({ id }) => id === dataElement.id
        );

        return {
            ...other,
            dataElement: {
                ...dataElement,
                displayName,
                valueType,
                optionSet,
            },
        };
    };
}

function AssignDataElements(props, { d2 }) {
    const itemStore = Store.create();
    const assignedItemStore = Store.create();

    itemStore.setState(
        props.trackerDataElements.map(dataElement => ({
            id: dataElement.id,
            text: dataElement.displayName,
            value: dataElement.id,
        }))
    );

    assignedItemStore.setState(
        props.model.programStageDataElements.map(v => v.dataElement.id)
    );

    const tableRows = props.model.programStageDataElements
        .map(addDisplayProperties(props.trackerDataElements))
        .map((programStageDataElement, index) => {
            return (
                <ProgramStageDataElement
                    key={programStageDataElement.id}
                    programStageDataElement={programStageDataElement}
                    onEditProgramStageDataElement={
                        props.onEditProgramStageDataElement
                    }
                />
            );
        });

    return (
        <Paper>
            <div style={{ padding: '2rem 3rem 4rem', ...(props.outerDivStyle)}}>
                <TextField
                    hintText={d2.i18n.getTranslation(
                        'search_available_selected_items'
                    )}
                    onChange={compose(
                        props.setDataElementFilter,
                        getOr('', 'target.value')
                    )}
                    value={props.dataElementFilter}
                    fullWidth
                />
                <GroupEditor
                    itemStore={itemStore}
                    assignedItemStore={assignedItemStore}
                    height={250}
                    filterText={props.dataElementFilter}
                    onAssignItems={props.onAssignItems}
                    onRemoveItems={props.onRemoveItems}
                />
            </div>
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Compulsory</TableHeaderColumn>
                        <TableHeaderColumn>
                            Allow provided elsewhere
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            Display in reports
                        </TableHeaderColumn>
                        <TableHeaderColumn>Date in future</TableHeaderColumn>
                        <TableHeaderColumn>
                            Render options as radio
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tableRows}
                </TableBody>
            </Table>
        </Paper>
    );
}

AssignDataElements.contextTypes = {
    d2: PropTypes.object,
    outerDivStyle: PropTypes.object
};

export default enhance(AssignDataElements);
