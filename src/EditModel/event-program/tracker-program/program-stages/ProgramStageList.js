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
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import { getTranslatablePropertiesForModelType } from '../../../../List/List.component';
import { translationSaved, translationError } from './contextActions';

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
        const modelType = 'programStage';
        this.state = {
            modelType: modelType,
            sharing: {
                id: null,
            },
            translate: {
                model: null,
            },
            tableColumns: getTableColumnsForType(modelType),
        };
    }

    openSharing = model => {
        this.setState({
            ...this.state,
            sharing: {
                ...this.state.sharing,
                id: model.id,
            },
        });
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
                  type={this.state.modelType}
                  open={!!this.state.sharing.id}
                  onRequestClose={this.closeSharing}
                  bodyStyle={{ minHeight: '400px' }}
              />
            : null;
    };

    openTranslate = model => {
        this.setState({
            ...this.state,
            translate: {
                ...this.state.translate,
                model: model,
            },
        });
    };

    renderTranslate = () => {
        return this.state.translate.model
            ? <TranslationDialog
                  objectToTranslate={this.state.translate.model}
                  objectTypeToTranslate={
                      this.state.translate.model.modelDefinition
                  }
                  open={!!this.state.translate.model}
                  onTranslationSaved={translationSaved}
                  onTranslationError={translationError}
                  onRequestClose={() =>
                      this.setState({
                          ...this.state,
                          translate: { ...this.state.translate, model: null },
                      })}
                  fieldsToTranslate={getTranslatablePropertiesForModelType(
                      this.state.modelType
                  )}
              />
            : null;
    };

    render() {
        const contextActions = {
            edit: this.props.handleEditProgramStage,
            share: this.openSharing,
            delete: this.props.handleDeleteProgramStage,
            translate: this.openTranslate,
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
                {this.renderTranslate()}
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
