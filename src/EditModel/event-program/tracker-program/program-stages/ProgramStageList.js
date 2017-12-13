import React, { Component } from 'react';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import programStore$ from '../../eventProgramStore';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import { get, noop, first, getOr, __ } from 'lodash/fp';
import {
    getTableColumnsForType,
    getFilterFieldsForType,
    getFiltersForType
} from '../../../../config/maintenance-models';
import withState from 'recompose/withState';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { addQuery } from '../../../../router-utils';

const program$ = programStore$.map(get('program'));
const programStages$ = programStore$.map(get('programStages'));

const enhance = withState(
    'tableColumns',
    'setTableColumns',
    getTableColumnsForType('programStage')
);

const handleNewProgramStage = () => {
    addQuery({ stage: 'new' });
};

const handleEditProgramStage = model => {
    addQuery({ stage: model.id });
};

const FAB = props => {
    const cssStyles = {
        textAlign: 'right',
        marginTop: '1rem',
        bottom: '1.5rem',
        right: '1.5rem',
        position: 'fixed',
        zIndex: 10
    };

    return (
        <div style={cssStyles}>
            <FloatingActionButton onClick={handleNewProgramStage}>
                <FontIcon className="material-icons">add</FontIcon>
            </FloatingActionButton>
        </div>
    );
};

const ProgramStageList = props => {
    return (
        <div>
            <DataTable
                rows={props.programStages}
                columns={props.tableColumns}
                primaryAction={handleEditProgramStage}
            />
            <FAB router={props.router} />
        </div>
    );
};

export default enhance(ProgramStageList);
