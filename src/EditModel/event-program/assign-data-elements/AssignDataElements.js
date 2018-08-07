import React, { PropTypes } from 'react';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Paper from 'material-ui/Paper/Paper';
import mapPropsStream from 'recompose/mapPropsStream';
import { get, first, getOr, __ } from 'lodash/fp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import TextField from 'material-ui/TextField/TextField';
import pure from 'recompose/pure';
import withState from 'recompose/withState';
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

import programStore from '../eventProgramStore';
import { withRouter } from 'react-router';
import RenderTypeSelectField, { getRenderTypeOptions, DATA_ELEMENT_CLAZZ, MOBILE, DESKTOP } from '../render-types';

const getFirstProgramStage = compose(first, get('programStages'));

// Use programStage$ prop if present, else use first programStage
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

const renderingOptions$ = programStore
    .map(get('renderingOptions'))
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
            renderingOptions$,
            (props, programStage, trackerDataElements, renderingOptions) => ({
                ...props,
                trackerDataElements,
                renderingOptions,
                model: programStage,
                items: programStage.programStageDataElements,
            })
        )
    ),
    withHandlers({
        onAssignItems: props => (dataElements) => {
            const { model, addDataElementsToStage } = props;
            addDataElementsToStage({ programStage: model.id, dataElements });
            return Promise.resolve();
        },
        onRemoveItems: ({
            model,
            removeDataElementsFromStage,
        }) => (dataElements) => {
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
        const onChangeFlipBooleanForProperty = propertyName => () =>
            onEditProgramStageDataElement(
                flipBooleanPropertyOn(programStageDataElement, propertyName),
            );
        const isCheckedForProp = getOr(false, __, programStageDataElement);

        return (
            <TableRow>
                <TableRowColumn title={programStageDataElement.dataElement.displayName}>
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
                                'allowFutureDate',
                            )}
                        />
                        : null}
                </TableRowColumn>
                <TableRowColumn>
                        <Checkbox
                            checked={isCheckedForProp('skipSynchronization')}
                            onClick={onChangeFlipBooleanForProperty(
                                'skipSynchronization',
                            )}
                        />
                </TableRowColumn>
                <TableRowColumn>
                    <RenderTypeSelectField
                        device={MOBILE}
                        target={programStageDataElement}
                        options={programStageDataElement.dataElement.renderTypeOptions}
                        changeHandler={onEditProgramStageDataElement}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <RenderTypeSelectField
                        device={DESKTOP}
                        target={programStageDataElement}
                        options={programStageDataElement.dataElement.renderTypeOptions}
                        changeHandler={onEditProgramStageDataElement}
                    />
                </TableRowColumn>
            </TableRow>
        );
    },
);

function addRenderingOptions(renderingOptions) {
    return (psde) => {
        const { dataElement, ...other } = psde;
        const renderTypeOptions = getRenderTypeOptions(dataElement, DATA_ELEMENT_CLAZZ, renderingOptions);

        return {
            ...other,
            dataElement: {
                ...dataElement,
                renderTypeOptions,
            },
        };
    };
}

function AssignDataElements(props, { d2 }) {
    const itemStore = Store.create();
    const assignedItemStore = Store.create();

    //Fix for DHIS2-4369 where some program stages may contain other dataelements than TRACKER
    //This is due to a database inconsistency. This fix makes it possible to show and be able to remove these
    //elements from the UI
    const otherElems = props.model.programStageDataElements
    .filter(v => {
        const { dataElement } = v;
        return dataElement.domainType && dataElement.domainType !== "TRACKER";
    })
    .map(v => {
        const dataElement = v.dataElement;
        return {
            id: dataElement.id,
            text: dataElement.displayName,
            value: dataElement.id,
        }});

    itemStore.setState(
        props.trackerDataElements.map(dataElement => ({
            id: dataElement.id,
            text: dataElement.displayName,
            value: dataElement.id,
        })).concat(otherElems)
    );

    assignedItemStore.setState(
        props.model.programStageDataElements.map(v => v.dataElement.id)
    );
    const tableRows = props.model.programStageDataElements
        .map(
            addRenderingOptions(props.renderingOptions))
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
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('name')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('compulsory')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('allow_provided_elsewhere')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('display_in_reports')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('date_in_future')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('skip_synchronization')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('render_type_mobile')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {d2.i18n.getTranslation('render_type_desktop')}
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
