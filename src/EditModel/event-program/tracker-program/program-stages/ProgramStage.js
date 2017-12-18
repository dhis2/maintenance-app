import React, { Component } from 'react';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import programStore$ from '../../eventProgramStore';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import { isEqual, get, noop, first, getOr, __, find } from 'lodash/fp';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { addQuery } from '../../../../router-utils';
import ProgramStageList from './ProgramStageList';
import EditProgramStage from './EditProgramStage';
import { withProgramAndStages } from "./utils";

const program$ = programStore$.map(get('program'));
const programStages$ = programStore$.map(get('programStages'));

const handleNewProgramStage = () => {
    addQuery({ stage: 'new' });
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

const shouldRenderStageEdit = location => {
    return location && location.query && location.query.stage;
};

const getProgramStageByQuery = stageId =>
    programStages$
        .flatMap(x => x)
        .filter(stage => stage.id && stage.id === stageId);

const enhance = compose(
    mapPropsStream(props$ =>
        props$.combineLatest(
            program$,
            programStages$,
            (props, program, programStages) => ({
                ...props,
                program,
                programStages
            })
        )
    )
);

const ProgramStage = props => {

    return (
        <div>
            {shouldRenderStageEdit(props.location)
                ? <EditProgramStage
                      program={props.program}
                      programStages={props.programStages}
                      programStage$={getProgramStageByQuery(props.location.query.stage)}
                  />
                : <ProgramStageList
                      program={props.program}
                      programStages={props.programStages}
                  />}
        </div>);
};
export default withProgramAndStages(ProgramStage);
