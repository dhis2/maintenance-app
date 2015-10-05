import React from 'react';
import {Navigation} from 'react-router';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import Translate from 'd2-ui/i18n/Translate.mixin';

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
    },

    mixins: [Navigation, Translate],

    render() {
        const cssStyles = {
            textAlign: 'right',
            marginTop: '1rem',
        };

        if (!this.context.d2.currentUser.canCreate(this.context.d2.models[this.props.modelType])) {
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

    _addClick() {
        this.transitionTo('genericEdit', {modelType: this.props.modelType, modelId: 'add'});
    },
});

export default ListActionBar;
