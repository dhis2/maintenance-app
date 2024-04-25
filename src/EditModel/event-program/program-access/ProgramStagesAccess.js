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
    generateSharingDescription,
} from './utils';
import { yellow800 } from 'material-ui/styles/colors';
import {
    transformLegacySharingToSharingObject,
    transformSharingObjectToLegacy,
} from '../../sharing';

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
    stageSharingItem: {
        height: '80px',
    },
};

class ProgramStagesAccess extends React.Component {
    constructor(props) {
        super(props);

        // Get (supersets of) sharing structures
        const programSharing = this.props.model.dataValues;
        const stagesSharing = Array.from(
            this.props.model.dataValues.programStages.valuesContainerMap
        ).map(stage => stage[1]);

        // Pre-select stages with similar sharing settings as program
        const selectedStages = [];
        stagesSharing.forEach(stage => {
            if (areSharingPropertiesSimilar(programSharing, stage)) {
                selectedStages.push(stage.id);
            }
        });

        this.state = {
            sharingDialogOpen: false,
            stagesSharing,
            programSharing,
            selectedStages,
        };
    }

    translate = s => this.context.d2.i18n.getTranslation(s);

    toggleStageSelection = id => (_, isChecked) => {
        this.setState({
            selectedStages: isChecked
                ? [...this.state.selectedStages, id]
                : this.state.selectedStages.filter(stage => stage !== id),
        });
    };

    selectSimilarStages = () => {
        const selectedStages = [];
        this.state.stagesSharing.forEach(stage => {
            if (areSharingPropertiesSimilar(stage, this.state.programSharing)) {
                selectedStages.push(stage.id);
            }
        });

        this.setState({
            selectedStages,
        });
    };

    selectAllStages = () => {
        this.setState({
            selectedStages: this.state.stagesSharing.map(stage => stage.id),
        });
    };

    deselectAllStages = () => {
        this.setState({
            selectedStages: [],
        });
    };

    openSharingDialog = (model, sharingType) => {
        const sharingProperties = transformSharingObjectToLegacy(model.sharing);
        const objectToShare = {
            meta: {
                allowPublicAccess: true,
                allowExternalAccess: false,
            },
            object: {
                user: model.user,
                displayName: model.displayName || model.name,
                userAccesses: sharingProperties.userAccesses,
                userGroupAccesses: sharingProperties.userGroupAccesses,
                publicAccess: sharingProperties.publicAccess,
                externalAccess: sharingProperties.externalAccess,
            },
        };

        this.setState({
            sharingDialogOpen: true,
            sharingType,
            sharingId: model.id,
            objectToShare,
        });
    };

    closeSharingDialog = () => {
        this.setState({
            sharingDialogOpen: false,
        });
    };

    confirmAndCloseSharingDialog = sharingDialogResult => {
        const updatedSharing = transformLegacySharingToSharingObject(
            sharingDialogResult
        );

        if (sharingDialogResult.id === this.state.programSharing.id) {
            this.updateProgramAccess(sharingDialogResult, updatedSharing);
        } else {
            this.updateStageAccess(sharingDialogResult, updatedSharing);
        }

        this.closeSharingDialog();
    };

    updateProgramAccess = (sharingDialogResult, updatedSharing) => {
        this.storeProgramChanges(updatedSharing);
        const programWithSharing = {
            id: sharingDialogResult.id,
            sharing: updatedSharing,
        };
        this.setState({
            programSharing: programWithSharing,
        });
    };

    updateStageAccess = (sharingDialogResult, updatedSharing) => {
        this.storeStageChanges(sharingDialogResult.id, updatedSharing);
        this.setState({
            stagesSharing: this.state.stagesSharing.map(
                stage =>
                    sharingDialogResult.id === stage.id
                        ? { ...stage, sharing: updatedSharing }
                        : stage
            ),
        });
    };

    storeProgramChanges = sharingProperties => {
        this.props.editFieldChanged('sharing', sharingProperties);
    };

    storeStageChanges = (stageId, sharingProperties) => {
        this.props.editProgramStageField(stageId, 'sharing', sharingProperties);
    };

    propagateAccess = event => {
        event.stopPropagation();

        const propagateIfSelected = stage => {
            const programSharing = this.state.programSharing.sharing;
            if (this.state.selectedStages.includes(stage.id)) {
                this.storeStageChanges(
                    stage.id,
                    programSharing
                );
                return {
                    sharing: programSharing,
                    id: stage.id,
                    displayName: stage.displayName || stage.name,
                };
            } else return stage;
        };
        const updatedStages = this.state.stagesSharing.map(propagateIfSelected);
        this.setState({
            stagesSharing: updatedStages,
        });
    };

    render = () => {
        const stagesWithSimilarAccessAsProgram = this.state.stagesSharing
            .filter(stage =>
                areSharingPropertiesSimilar(this.state.programSharing, stage)
            )
            .map(stage => stage.id);

        const stageSharingList = this.state.stagesSharing.map(stage => {
            const leftAvatar = stagesWithSimilarAccessAsProgram.includes(
                stage.id
            ) ? (
                <div />
            ) : (
                <IconButton
                    style={{ pointer: 'default' }}
                    tooltip={this.translate('differs_from_program')}
                >
                    <WarningIcon style={styles.warningIcon} color={yellow800} />
                </IconButton>
            );

            return (
                <ListItem
                    style={styles.stageSharingItem}
                    onClick={() =>
                        this.openSharingDialog(stage, 'programStage')
                    }
                    leftAvatar={leftAvatar}
                    key={stage.id}
                    primaryText={stage.displayName || stage.name}
                    secondaryText={generateSharingDescription(stage)}
                />
            );
        });

        const checkBoxList = this.state.stagesSharing.map(stage => (
            <Checkbox
                key={stage.id}
                style={{
                    height: '80px',
                    paddingTop: '24px',
                    paddingLeft: '32px',
                }}
                onCheck={this.toggleStageSelection(stage.id)}
                checked={this.state.selectedStages.includes(stage.id)}
            />
        ));

        return (
            <div style={styles.container}>
                <ListItem
                    onClick={() =>
                        this.openSharingDialog(this.props.model, 'program')
                    }
                    primaryText={
                        this.props.model.displayName || this.props.model.name
                    }
                    secondaryText={generateSharingDescription(
                        this.state.programSharing
                    )}
                    rightIconButton={
                        <FlatButton
                            primary
                            disabled={this.state.selectedStages.length === 0}
                            style={{ height: 45 }}
                            icon={<ArrowDownwardIcon />}
                            label={this.translate('apply_to_selected_stages')}
                            labelPosition="before"
                            onClick={this.propagateAccess}
                        />
                    }
                />
                <Divider />
                <Toolbar
                    selectAll={this.selectAllStages}
                    deselectAll={this.deselectAllStages}
                    selectSimilar={this.selectSimilarStages}
                    areNoneSelected={this.state.selectedStages.length === 0}
                    areAllSelected={
                        this.state.selectedStages.length ===
                        this.state.stagesSharing.length
                    }
                />
                {this.state.stagesSharing.length !== 0 && (
                    <div style={styles.programStageList}>
                        <div style={{ flex: 1 }}>{stageSharingList}</div>
                        <div>{checkBoxList}</div>
                    </div>
                )}
                <SharingDialog
                    doNotPost
                    sharedObject={this.state.objectToShare}
                    open={this.state.sharingDialogOpen}
                    id={this.state.sharingId}
                    type={this.state.sharingType}
                    onRequestClose={this.closeSharingDialog}
                    onConfirm={this.confirmAndCloseSharingDialog}
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
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgramStagesAccess);
