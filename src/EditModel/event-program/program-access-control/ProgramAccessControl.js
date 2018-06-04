import React from 'react';
import Heading from 'd2-ui/lib/headings/Heading.component';
import IconButton from 'material-ui/IconButton/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import CheckIcon from 'material-ui/svg-icons/action/done-all';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { Checkbox } from 'material-ui';
import { blue500 } from 'material-ui/styles/colors';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';
import { isEqual } from 'lodash/fp';
import { yellow500 } from 'material-ui/styles/colors';

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
    },
};

const areSharingPropertiesSimilar = (a, b) => {
    if (!isEqual(a.publicAccess, b.publicAccess)) return false;
    if (!isEqual(a.externalAccess, b.externalAccess)) return false;

    const compareFunction = (a, b) => a.id < b.id;
    if (
        !isEqual(
            Array.sort(a.userAccesses, compareFunction),
            Array.sort(b.userAccesses, compareFunction),
        )
    ) {
        return false;
    }

    return isEqual(
        Array.sort(a.userGroupAccesses, compareFunction),
        Array.sort(b.userGroupAccesses, compareFunction),
    );
};

class ProgramAccessControl extends React.Component {
    state = {
        propagateAccess: true,
        sharingDialogOpen: false,
    };

    constructor(props) {
        super(props);

        const programSharing = this.props.model.dataValues;
        const stagesSharing = Array.from(
            this.props.model.dataValues.programStages.valuesContainerMap,
        ).map(stage => stage[1]);

        const stageAccessToggle = {},
            stageAccessPropagate = {};
        stagesSharing.forEach(stage => {
            stageAccessPropagate[stage.id] = true;
            stageAccessToggle[stage.id] = areSharingPropertiesSimilar(programSharing, stage);
        });

        const stagesWithSimilarAccessAsProgram = Object.keys(stageAccessToggle).filter(
            stageId => stageAccessToggle[stageId],
        );

        this.state = {
            stagesSharing,
            stageAccessToggle,
            stageAccessPropagate,
            allToggledForPropagation: this.areAllStagesToggledForPropagation(stageAccessToggle),
            stagesWithSimilarAccessAsProgram,
        };
    }

    areAllStagesToggledForPropagation = stageAccessToggle =>
        Object.values(stageAccessToggle).reduce((acc, b) => acc && b);

    togglePropagateAccess = event => {
        event.stopPropagation();
        this.setState({
            propagateAccess: !this.state.propagateAccess,
        });
    };

    togglePropagationForAllStages = () => {
        this.setState({
            stageAccessToggle: { ...this.state.stageAccessPropagate },
            allToggledForPropagation: true,
        });
    };

    openSharingDialog = (sharingId, sharingType) => {
        this.setState({
            sharingDialogOpen: true,
            sharingId,
            sharingType,
        });
    };

    closeSharingDialog = () => {
        this.setState({
            sharingDialogOpen: false,
        });
    };

    toggleStagePropagation = id => (event, isChecked) => {
        console.warn('Toggling shit ...', id);
        const stageAccessToggle = {
            ...this.state.stageAccessToggle,
            [id]: isChecked,
        };

        this.setState({
            stageAccessToggle,
            allToggledForPropagation: this.areAllStagesToggledForPropagation(stageAccessToggle),
        });
    };

    extractDisplayName = model => model.dataValues.displayName;
    extractUserGroupLength = model => model.dataValues.userGroupAccesses.length;

    render = () => (
        <div style={styles.container}>
            {this.state.sharingDialogOpen && (
                <SharingDialog
                    open={this.state.sharingDialogOpen}
                    id={this.state.sharingId}
                    type={this.state.sharingType}
                    onRequestClose={this.closeSharingDialog}
                />
            )}
            <ListItem
                onClick={() => this.openSharingDialog(this.props.model.dataValues.id, 'program')}
                primaryText={this.extractDisplayName(this.props.model)}
                secondaryText={`Accessible to ${this.extractUserGroupLength(
                    this.props.model,
                )} user groups`}
                rightIconButton={
                    <FlatButton
                        primary
                        disabled={Object.values(this.state.stageAccessToggle).reduce(
                            (acc, b) => !(acc || b),
                        )}
                        style={{ height: 45 }}
                        icon={<ArrowDownwardIcon />}
                        label="Apply to selected stages"
                        labelPosition="before"
                        onClick={this.togglePropagateAccess}
                    />
                }
            />
            <Divider />
            <Toolbar
                checkAll={this.togglePropagationForAllStages}
                allChecked={this.state.allToggledForPropagation}
            />
            {this.state.stagesSharing.length !== 0 && (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        {this.state.stagesSharing.map(stage => (
                            <ListItem
                                style={{ height: '80px' }}
                                onClick={() =>
                                    !this.state.propagateAccess &&
                                    this.openSharingDialog(stage.id, 'programStage')
                                }
                                leftAvatar={
                                    this.state.stagesWithSimilarAccessAsProgram.includes(
                                        stage.id,
                                    ) ? (
                                        <div />
                                    ) : (
                                        <WarningIcon
                                            style={{ top: '22px', height: '32px', width: '32px' }}
                                            color={yellow500}
                                        />
                                    )
                                }
                                key={stage.id}
                                disabled={this.state.propagateAccess}
                                primaryText={stage.displayName}
                                secondaryText={`Accessible to ${
                                    stage.userGroupAccesses.length
                                } user groups`}
                            />
                        ))}
                    </div>
                    <div>
                        {this.state.stagesSharing.map(stage => (
                            <Checkbox
                                key={stage.id}
                                style={{ height: '80px', paddingTop: '24px', paddingLeft: '32px' }}
                                onCheck={this.toggleStagePropagation(stage.id)}
                                checked={this.state.stageAccessToggle[stage.id]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const Toolbar = ({ checkAll, allChecked }) => (
    <div
        style={{
            alignSelf: 'flex-end',
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}
    >
        <FlatButton
            primary
            labelPosition="before"
            disabled={allChecked}
            style={{ height: 45 }}
            icon={<CheckIcon />}
            label="Select all"
            onClick={checkAll}
        />
    </div>
);

export default ProgramAccessControl;
