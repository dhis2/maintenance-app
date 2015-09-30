import React from 'react';
import {Navigation} from 'react-router';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
    },

    mixins: [Navigation],

    render() {
        const cssStyles = {
            textAlign: 'right',
            marginTop: '1rem',
        };

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
