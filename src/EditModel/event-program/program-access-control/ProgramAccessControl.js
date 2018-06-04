import React from 'react';
import PropTypes from 'prop-types';
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
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
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

const extractDisplayName = model => model.dataValues.displayName;
const extractUserGroupLength = model => model.dataValues.userGroupAccesses.length;

const getPublicAccessDescription = publicAccess => {
    if (publicAccess.substr(0, 4) === '----') return 'No public access';
    if (publicAccess.substr(0, 4) === 'rwrw') return 'Complete public access';

    let description = '';
    switch (publicAccess.substr(0, 2)) {
        case 'rw':
            description += 'Public metadata read- and write access';
            break;
        case 'r-':
            description += 'Public metadata read access';
            break;
        default:
            description += 'No public metadata access';
            break;
    }

    description = description += ', ';

    switch (publicAccess.substr(2, 2)) {
        case 'rw':
            return description + 'public data read- and write access';
        case 'r-':
            return description + 'public data read access';
        default:
            return description + 'no public data access';
    }
};

const generateSharingDescription = model => {
    console.warn('Input: ', model);
    const publicAccessDescription = getPublicAccessDescription(model.publicAccess);
    const userGroupCount = model.dataValues.userGroupAccesses.length;
    const userCount = model.dataValues.userAccesses.length;

    let description = publicAccessDescription;
    if (userCount || userGroupCount) {
        description += ', accessible to ';
        if (userCount) {
            const plural = (userCount > 1) ? 's' : ''
            description += `${userCount} user${plural}`;
        }

        if (userGroupCount) {
            if (userCount)
                description += ' and ';

            const plural = (userGroupCount > 1) ? 's' : ''
            description += `${userGroupCount} user group${plural}`;
        }
    }

    return description;
};

class ProgramAccessControl extends React.Component {
    state = {
        propagateAccess: true,
        sharingDialogOpen: false,
    };

    constructor(props, context) {
        super(props);

        const programSharing = this.props.model.dataValues;
        const stagesSharing = Array.from(
            this.props.model.dataValues.programStages.valuesContainerMap,
        ).map(stage => stage[1]);

        const propagationMap = {},
            propagationMapAllEnabled = {};
        stagesSharing.forEach(stage => {
            propagationMapAllEnabled[stage.id] = true;
            propagationMap[stage.id] = areSharingPropertiesSimilar(programSharing, stage);
        });

        const stagesWithSimilarAccessAsProgram = Object.keys(propagationMap).filter(
            stageId => propagationMap[stageId],
        );

        this.state = {
            sharingDialogOpen: false,
            stagesSharing,
            propagationMap,
            propagationMapAllEnabled,
            fullPropagation: this.areAllStagesToggledForPropagation(propagationMap),
            stagesWithSimilarAccessAsProgram,
        };
    }

    areAllStagesToggledForPropagation = propagationMap =>
        Object.values(propagationMap).reduce((acc, b) => acc && b);

    togglePropagateAccess = event => {
        event.stopPropagation();
        this.setState({
            propagateAccess: !this.state.propagateAccess,
        });
    };

    togglePropagationForAllStages = () => {
        this.setState({
            propagationMap: { ...this.state.propagationMapAllEnabled },
            fullPropagation: true,
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
        const propagationMap = {
            ...this.state.propagationMap,
            [id]: isChecked,
        };

        this.setState({
            propagationMap,
            fullPropagation: this.areAllStagesToggledForPropagation(propagationMap),
        });
    };

    render = () => {
        console.warn('d2:', this.context.d2);
        return (
            <div style={styles.container}>
                <ListItem
                    onClick={() =>
                        this.openSharingDialog(this.props.model.dataValues.id, 'program')
                    }
                    primaryText={extractDisplayName(this.props.model)}
                    secondaryText={generateSharingDescription(this.props.model)}
                    rightIconButton={
                        <FlatButton
                            primary
                            disabled={Object.values(this.state.propagationMap).reduce(
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
                    fullPropagation={this.state.fullPropagation}
                />
                {this.state.stagesSharing.length !== 0 && (
                    <div style={styles.programStageList}>
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
                                                style={styles.warningIcon}
                                                color="lightGray"
                                            />
                                        )
                                    }
                                    key={stage.id}
                                    disabled={this.state.propagateAccess}
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
                                    onCheck={this.toggleStagePropagation(stage.id)}
                                    checked={this.state.propagationMap[stage.id]}
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

ProgramAccessControl.contextTypes = {
    d2: PropTypes.object,
};

const Toolbar = ({ checkAll, fullPropagation }) => (
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
            disabled={fullPropagation}
            style={{ height: 45 }}
            icon={<CheckIcon />}
            label="Select all"
            onClick={checkAll}
        />
    </div>
);

export default ProgramAccessControl;
