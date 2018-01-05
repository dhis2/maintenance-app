import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import { goToRoute } from '../router-utils';
import { withAuth } from "../utils/Auth";
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
        groupName: React.PropTypes.string.isRequired,
    },

    _addClick() {
        goToRoute(`/edit/${this.props.groupName}/${this.props.modelType}/add`);
    },

    render() {
        const cssStyles = {
            textAlign: 'right',
            marginTop: '1rem',
            bottom: '1.5rem',
            right: '1.5rem',
            position: 'fixed',
            zIndex: 10,
        };

        const modelDefinition = this.props.getModelDefinitionByName(
            this.props.modelType
        );

        if (!this.props.getCurrentUser().canCreate(modelDefinition)) {
            return null;
        }

        return (
            <div style={cssStyles}>
                {this.props.modelType === 'program' ? <ProgramSpeedDial {...this.props} /> : (<FloatingActionButton onClick={this._addClick}>
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>)}
            </div>
        );
    },
});

export default withAuth(ListActionBar);
