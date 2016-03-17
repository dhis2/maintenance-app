import React from 'react';
import { hashHistory } from 'react-router';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import Auth from 'd2-ui/lib/auth/Auth.mixin';

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
    },

    mixins: [Auth],

    _addClick() {
        hashHistory.push(`/edit/${this.props.modelType}/add`);
    },

    render() {
        const cssStyles = {
            textAlign: 'right',
            marginTop: '1rem',
        };

        if (!this.getCurrentUser().canCreate(this.getModelDefinitionByName(this.props.modelType))) {
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
