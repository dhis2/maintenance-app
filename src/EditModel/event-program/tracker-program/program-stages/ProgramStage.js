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
import { connect } from 'react-redux';
import { getProgramStageById$, firstProgramStage$ } from './utils';
import { getCurrentProgramStageId } from './selectors';
import { editProgramStage } from './actions';

class ProgramStage extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.programStage === this.props.programStage;
    }

    render() {
        const props = this.props;

        const programStage$ =
            props.currentProgramStageId !== 'add' &&
            getProgramStageById$(props.currentProgramStageId).defaultIfEmpty(
                firstProgramStage$
            );

        return (
            <div>
                {!!this.props.currentProgramStageId
                    ? <EditProgramStage programStage$={programStage$} />
                    : <ProgramStageList
                          program={props.program}
                          programStages={props.programStages}
                      />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentProgramStageId: getCurrentProgramStageId(state),
});

const mapDispatchToProps = dispatch => ({
    editProgramStage(id) {
        dispatch(editProgramStage(id));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withProgramAndStages
)(ProgramStage);
