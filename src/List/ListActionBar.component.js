import React from 'react';
import { hashHistory } from 'react-router';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import { goToRoute } from '../router';

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
        groupName: React.PropTypes.string.isRequired,
    },

    mixins: [Auth],

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

        const modelDefinition = this.getModelDefinitionByName(this.props.modelType);

        if (!this.getCurrentUser().canCreate(modelDefinition)) {
            return null;
        }

        return (
            <div style={cssStyles}>
                <FloatingActionButton onClick={this._addClick}>
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>
            </div>
        );
    },
});

export default ListActionBar;
