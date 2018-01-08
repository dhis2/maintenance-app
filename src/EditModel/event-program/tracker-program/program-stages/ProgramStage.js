import React, { Component } from 'react';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import programStore$ from '../../eventProgramStore';
import { compose, mapProps, mapPropsStream } from 'recompose';
import { isEqual, get, noop, first, getOr, __, find } from 'lodash/fp';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { addQuery } from '../../../../router-utils';
import ProgramStageList from './ProgramStageList';
import EditProgramStage from './EditProgramStage';
import { withProgramAndStages } from './utils';
import { connect } from 'react-redux';

import { getCurrentProgramStage } from "./selectors";
import { editProgramStage } from "./actions";

const program$ = programStore$.map(get('program'));
const programStages$ = programStore$.map(get('programStages'));
const getFirstProgramStage = compose(first, get('programStages'));
const firstProgramStage$ = programStore$.map(getFirstProgramStage);
const handleNewProgramStage = () => {
    addQuery({ stage: 'add' });
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

const getProgramStageById = stageId =>
    programStages$
        .flatMap(x => x)
        .filter(stage => stage.id && stage.id === stageId)
        .defaultIfEmpty(firstProgramStage$)

class ProgramStage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    componentDidMount() {


    }

    shouldComponentUpdate(nextProps, nextState) {

        if(nextProps.programStage !== this.props.programStage)
            return false;
        return true;
    }


    shouldRenderStageEdit = () => (!!this.props.currentProgramStageId)

    createNewProgramStage = () => {

    }

    render() {
        const props = this.props;
        console.log(props.programStages)

        const programStage$ = props.currentProgramStageId !== "add" && getProgramStageById(props.currentProgramStageId);

      //  console.log(shouldRenderStageEdit())
        return (
            <div>
                {this.shouldRenderStageEdit()
                    ? <EditProgramStage
                          programStage$={programStage$}
                      />
                    : <ProgramStageList
                          program={props.program}
                          programStages={props.programStages}
                      />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentProgramStageId: getCurrentProgramStage(state)
})

const mapDispatchToProps = dispatch => ({
    editProgramStage(id) {
        dispatch(editProgramStage(id))
    }
});

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withProgramAndStages)(ProgramStage);
