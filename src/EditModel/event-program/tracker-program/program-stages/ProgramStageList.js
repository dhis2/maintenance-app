import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';

import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';

import { getTableColumnsForType } from '../../../../config/maintenance-models';
import { getTranslatablePropertiesForModelType } from '../../../../List/List.component';
import { translationSaved, translationError } from './contextActions';
import {
    editProgramStage,
    addProgramStage,
    deleteProgramStage,
} from './actions';

const FAB = (props) => {
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

FAB.propTypes = {
    handleNewProgramStage: PropTypes.func.isRequired,
};

class ProgramStageList extends Component {
    constructor(props) {
        super(props);
        const modelType = 'programStage';

        this.state = {
            stages: this.props.programStages,
            modelType,
            sharing: {
                id: null,
            },
            translate: {
                model: null,
            },
            tableColumns: getTableColumnsForType(modelType),
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.stages != nextProps.programStages && this.props.programStages != nextProps.programStages) {
            this.setState({
                ...this.state,
                stages: nextProps.programStages
            })
        }
    }

    openSharing = (model) => {
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
    openTranslate = (model) => {
        this.setState({
            ...this.state,
            translate: {
                ...this.state.translate,
                model,
            },
        });
    };

    handleOnRequestClose = () => {
        this.setState({
            ...this.state,
            translate: { ...this.state.translate, model: null },
        });
    }

    swapStages = (stageA, stageB) => {
        this.setState((state) => {
            const swapOrder = stageA.sortOrder;
            stageA.sortOrder = stageB.sortOrder; // eslint-disable-line
            stageB.sortOrder = swapOrder; // eslint-disable-line
            return {
                sections: state.stages.sort((a, b) => a.sortOrder - b.sortOrder),
            };
        });
    }

    contextActionChecker = (model, action) => {
        if (action === 'move_up') {
            return this.state.stages.indexOf(model) > 0;
        } else if (action === 'move_down') {
            return this.state.stages.indexOf(model) < this.state.stages.length - 1;
        }
        return true;
    };

    moveStageUp = (stage) => {
        const currentIndex = this.state.stages.indexOf(stage);
        if (currentIndex > 0) {
            const swapStage = this.state.stages[currentIndex - 1];
            this.swapStages(swapStage, stage);
        }
    }

    moveStageDown = (stage) => {
        const currentIndex = this.state.stages.indexOf(stage);
        if (currentIndex < this.state.stages.length - 1) {
            const swapStage = this.state.stages[currentIndex + 1];
            this.swapStages(swapStage, stage);
        }
    }

    renderSharing = () => (!!this.state.sharing.id
        && <SharingDialog
            id={this.state.sharing.id}
            type={this.state.modelType}
            open={!!this.state.sharing.id}
            onRequestClose={this.closeSharing}
            bodyStyle={{ minHeight: '400px' }}
        />);

    renderTranslate = () => (!!this.state.translate.model
        && <TranslationDialog
            objectToTranslate={this.state.translate.model}
            objectTypeToTranslate={
                this.state.translate.model.modelDefinition
            }
            open={!!this.state.translate.model}
            onTranslationSaved={translationSaved}
            onTranslationError={translationError}
            onRequestClose={this.handleOnRequestClose}
            fieldsToTranslate={getTranslatablePropertiesForModelType(
                this.state.modelType,
            )}
        />);

    render() {
        const contextActions = {
            edit: this.props.handleEditProgramStage,
            share: this.openSharing,
            delete: this.props.handleDeleteProgramStage,
            translate: this.openTranslate,
            move_up: this.moveStageUp,
            move_down: this.moveStageDown,
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
                    rows={this.state.stages}
                    columns={this.props.tableColumns}
                    primaryAction={this.props.handleEditProgramStage}
                    contextMenuActions={contextActions}
                    contextMenuIcons={contextMenuIcons}
                    isContextActionAllowed={this.contextActionChecker}
                />
                <FAB {...this.props} />
                {this.renderSharing()}
                {this.renderTranslate()}
            </div>
        );
    }
}

ProgramStageList.propTypes = {
    programStages: PropTypes.array.isRequired,
    tableColumns: PropTypes.array,
    handleEditProgramStage: PropTypes.func.isRequired,
    handleDeleteProgramStage: PropTypes.func.isRequired,
};

ProgramStageList.defaultProps = {
    tableColumns: ['name', 'lastUpdated'],
};

export default connect(null, dispatch =>
    bindActionCreators(
        {
            handleEditProgramStage: model => editProgramStage(model.id),
            handleNewProgramStage: () => addProgramStage(),
            handleDeleteProgramStage: model => deleteProgramStage(model.id),
        },
        dispatch,
    ),
)(ProgramStageList);
