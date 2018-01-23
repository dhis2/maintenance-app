import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import programStore$ from '../../eventProgramStore';
import {
    compose,
    lifecycle,
    withHandlers,
    withState,
    withStateHandlers,
} from 'recompose';
import { get, noop, first, getOr, __, sortBy } from 'lodash/fp';
import {
    getTableColumnsForType,
    getFilterFieldsForType,
    getFiltersForType,
} from '../../../../config/maintenance-models';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { addQuery } from '../../../../router-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    editProgramStage,
    addProgramStage,
    deleteProgramStage,
} from './actions';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';

const FAB = props => {
    const cssStyles = {
        textAlign: 'right',
        marginTop: '1rem',
        bottom: '1.5rem',
        right: '1.5rem',
        position: 'fixed',
        zIndex: 10,
    };

    return (
        <div style={cssStyles}>
            <FloatingActionButton onClick={props.handleNewProgramStage}>
                <FontIcon className="material-icons">add</FontIcon>
            </FloatingActionButton>
        </div>
    );
};

function isContextActionAllowed(model, action) {
    return true;
}

class ProgramStageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sharing: {
                modelType: 'programStage',
                id: null,
            },
            translate: {},
            tableColumns: getTableColumnsForType('programStage'),
        };
    }

    openSharing = model => {
        this.setState({
            ...this.state,
            sharing: {
                ...this.state.sharing,
                id: model.id
            }
        })
    };

    closeSharing = () => {
        this.setState({
            ...this.state,
            sharing: {
                ...this.state.sharing,
                id: null,
            },
        });
    };

    renderSharing = () => {
        return this.state.sharing.id
            ? <SharingDialog
                  id={this.state.sharing.id}
                  type={this.state.sharing.modelType}
                  open={!!this.state.sharing.id}
                  onRequestClose={this.closeSharing}
                  bodyStyle={{ minHeight: '400px' }}
              />
            : null;
    };

    render() {
        const contextActions = {
            edit: this.props.handleEditProgramStage,
            share: this.openSharing,
            delete: this.props.handleDeleteProgramStage,
            translate: () => {},
        };

        const contextMenuIcons = {
            edit: 'edit',
            share: 'share',
            move_up: 'arrow_upward',
            move_down: 'arrow_downward',
        };

        return (
            <div>
                <DataTable
                    rows={this.props.programStages}
                    columns={this.props.tableColumns}
                    primaryAction={this.props.handleEditProgramStage}
                    contextMenuActions={contextActions}
                    contextMenuIcons={contextMenuIcons}
                    isContextActionAllowed={isContextActionAllowed}
                />
                <FAB {...this.props} />
                {this.renderSharing()}
            </div>
        );
    }
}

ProgramStageList.propTypes = {
    programStages: PropTypes.array,
};
export default connect(null, dispatch =>
    bindActionCreators(
        {
            handleEditProgramStage: model => editProgramStage(model.id),
            handleNewProgramStage: () => addProgramStage(),
            handleDeleteProgramStage: model => deleteProgramStage(model.id),
        },
        dispatch
    )
)(ProgramStageList);
