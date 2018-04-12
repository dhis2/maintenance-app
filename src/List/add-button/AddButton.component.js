import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import ProgramSpeedDial from './ProgramSpeedDial.component';

import { withAuth } from '../../utils/Auth';
import { goToRoute } from '../../router-utils';

const styles = {
    textAlign: 'right',
    marginTop: '1rem',
    bottom: '1.5rem',
    right: '1.5rem',
    position: 'fixed',
    zIndex: 10,
};

class AddButton extends Component {
    addClick = () => {
        goToRoute(`/edit/${this.props.groupName}/${this.props.modelType}/add`);
    }

    render() {
        const modelDefinition = this.props.getModelDefinitionByName(this.props.modelType);

        if (!this.props.getCurrentUser().canCreate(modelDefinition)) {
            return null;
        }

        return (
            <div style={styles}>
                {this.props.modelType === 'program'
                    ? <ProgramSpeedDial
                        groupName={this.props.groupName}
                        modelType={this.props.modelType}
                    />
                    : (<FloatingActionButton onClick={this.addClick}>
                        <FontIcon className="material-icons">add</FontIcon>
                    </FloatingActionButton>)
                }
            </div>
        );
    }
}

AddButton.propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    getModelDefinitionByName: PropTypes.func.isRequired,
    modelType: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
};

export default withAuth(AddButton);
