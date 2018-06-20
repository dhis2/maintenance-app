import React from 'react';
import PropTypes from 'prop-types';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import { Checkbox } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editFieldChanged } from '../actions';
import { editProgramStageField } from '../tracker-program/program-stages/actions';
import Toolbar from './Toolbar';
import {
    areSharingPropertiesSimilar,
    extractDisplayName,
    generateSharingDescription,
    areAllItemsTrue,
    areAllItemsFalse,
} from './utils';
import { yellow800 } from 'material-ui/styles/colors';

const styles = {
    container: {
        paddingTop: 32,
        display: 'flex',
        flexDirection: 'column',
    },
    vertical: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    horizontal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    programHeading: {
        padding: '5px 0px',
    },
    accessDescription: {
        color: '#aaa',
        fontWeight: 400,
        overflow: 'hidden',
    },
    programStageList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    warningIcon: {
        top: '22px',
        height: '32px',
        width: '32px',
    },
};

class ProgramStagesAccess extends React.Component {
    state = {
        sharingDialogOpen: false,
    };

    constructor(props, context) {
        super(props);

        // Get (supersets of) sharing structures
        const programSharing = this.props.model.dataValues;
        const stagesSharing = Array.from(
            this.props.model.dataValues.programStages.valuesContainerMap,
        ).map(stage => stage[1]);

        // Pre-select stages with similar sharing settings as program
        const selectedStages = {};
        const stagesWithSimilarAccessAsProgram = [];
        stagesSharing.forEach(stage => {
            if (areSharingPropertiesSimilar(programSharing, stage)) {
                stagesWithSimilarAccessAsProgram.push(stage.id);
                selectedStages[stage.id] = true;
            } else {
                selectedStages[stage.id] = false;
            }
        });

        this.state = {
            sharingDialogOpen: false,
            stagesSharing,
            programSharing,
            selectedStages,
            stagesWithSimilarAccessAsProgram,
        };
    }

    updateInternalState = () => {
        const stagesWithSimilarAccessAsProgram = this.state.stagesSharing
            .filter(stage => areSharingPropertiesSimilar(this.state.programSharing, stage))
            .map(stage => stage.id);

        this.setState({
            stagesWithSimilarAccessAsProgram,
        });
    };

    propagateAccess = event => {
        event.stopPropagation();

        // Propagate sharing properties from program to program stages
        this.state.stagesSharing.forEach(stage => {
            if (this.state.selectedStages[stage.id]) {
                ['publicAccess', 'userAccesses', 'userGroupAccesses'].forEach(property => {
                    this.props.editProgramStageField(
                        stage.id,
                        property,
                        this.state.programSharing[property],
                    );
                });
            }
        });

        const propagateIfSelected = stage => {
            if (this.state.selectedStages[stage.id]) {
                return {
                    ...this.state.programSharing,
                    id: stage.id,
                    displayName: stage.displayName,
                };
            } else return stage;
        };

        this.setState(
            {
                stagesSharing: this.state.stagesSharing.map(propagateIfSelected),
            },
            this.updateInternalState,
        );
    };

    selectStage = id => (_, isChecked) => {
        this.setState(
            {
                selectedStages: {
                    ...this.state.selectedStages,
                    [id]: isChecked,
                },
            },
            this.updateInternalState,
        );
    };

    selectAllStages = () => {
        const selectedStages = {};
        Object.keys(this.state.selectedStages).forEach(key => {
            selectedStages[key] = true;
        });

        this.setState({
            selectedStages,
        });
    };

    deselectAllStages = () => {
        const selectedStages = {};
        Object.keys(this.state.selectedStages).forEach(key => {
            selectedStages[key] = false;
        });

        this.setState({
            selectedStages,
        });
    };

    openSharingDialog = (sharingId, sharingType) => {
        this.setState({
            sharingDialogOpen: true,
            sharingId,
            sharingType,
        });
    };

    closeSharingDialog = updatedSharing => {
        if (!updatedSharing.userAccesses) updatedSharing.userAccesses = [];
        if (!updatedSharing.userGroupAccesses) updatedSharing.userGroupAccesses = [];

        const stateUpdate = {
            sharingDialogOpen: false,
        };

        if (updatedSharing.id === this.state.programSharing.id) {
            stateUpdate.programSharing = updatedSharing;
        } else {
            const stageIndex = this.state.stagesSharing.findIndex(
                stage => stage.id === updatedSharing.id,
            );
            stateUpdate.stagesSharing = this.state.stagesSharing;
            stateUpdate.stagesSharing[stageIndex] = updatedSharing;
        }

        this.setState(stateUpdate, this.updateInternalState);
    };

    render = () => {
        return (
            <div style={styles.container}>
                <ListItem
                    onClick={() =>
                        this.openSharingDialog(this.props.model.dataValues.id, 'program')
                    }
                    primaryText={extractDisplayName(this.props.model)}
                    secondaryText={generateSharingDescription(this.state.programSharing)}
                    rightIconButton={
                        <FlatButton
                            primary
                            disabled={areAllItemsFalse(Object.values(this.state.selectedStages))}
                            style={{ height: 45 }}
                            icon={<ArrowDownwardIcon />}
                            label="Apply to selected stages"
                            labelPosition="before"
                            onClick={this.propagateAccess}
                        />
                    }
                />
                <Divider />
                <Toolbar
                    selectAll={this.selectAllStages}
                    deselectAll={this.deselectAllStages}
                    areAllSelected={areAllItemsTrue(Object.values(this.state.selectedStages))}
                    areNoneSelected={areAllItemsFalse(Object.values(this.state.selectedStages))}
                />
                {this.state.stagesSharing.length !== 0 && (
                    <div style={styles.programStageList}>
                        <div style={{ flex: 1 }}>
                            {this.state.stagesSharing.map(stage => (
                                <ListItem
                                    style={{ height: '80px' }}
                                    onClick={() => this.openSharingDialog(stage.id, 'programStage')}
                                    leftAvatar={
                                        this.state.stagesWithSimilarAccessAsProgram.includes(
                                            stage.id,
                                        ) ? (
                                            <div />
                                        ) : (
                                            <IconButton 
                                                style={{ pointer: 'default' }}
                                                tooltip="Differs from program"
                                            >
                                                <WarningIcon
                                                    style={styles.warningIcon}
                                                    color={yellow800}
                                                />
                                            </IconButton>
                                        )
                                    }
                                    key={stage.id}
                                    primaryText={stage.displayName}
                                    secondaryText={generateSharingDescription(stage)}
                                />
                            ))}
                        </div>
                        <div>
                            {this.state.stagesSharing.map(stage => (
                                <Checkbox
                                    key={stage.id}
                                    style={{
                                        height: '80px',
                                        paddingTop: '24px',
                                        paddingLeft: '32px',
                                    }}
                                    onCheck={this.selectStage(stage.id)}
                                    checked={this.state.selectedStages[stage.id]}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <SharingDialog
                    open={this.state.sharingDialogOpen}
                    id={this.state.sharingId}
                    type={this.state.sharingType}
                    onRequestClose={this.closeSharingDialog}
                    d2={this.context.d2}
                />
            </div>
        );
    };
}

ProgramStagesAccess.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            editFieldChanged,
            editProgramStageField,
        },
        dispatch,
    );
    
export default connect(
    mapStateToProps,
    mapDispatchToProps,  
)(ProgramStagesAccess);
