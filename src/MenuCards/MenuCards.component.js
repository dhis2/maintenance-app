import React from 'react';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import IconButton from 'material-ui/lib/icon-button';

import Translate from 'd2-ui/lib/i18n/Translate.mixin';

export default React.createClass({
    propTypes: {
        menuItems: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            description: React.PropTypes.string,
        })),
    },

    mixins: [Translate],

    getDefaultProps() {
        return {
            menuItems: [],
        };
    },

    renderCard(details, index) {
        const cardStyle = {
            padding: '0',
            margin: '.5rem',
            float: 'left',
            width: '230px',
        };

        const headerStyle = {
            padding: '1rem',
            height: 'auto',
            borderBottom: '1px solid #ddd',
            cursor: 'pointer',
        };

        const textStyle = {
            height: '85px',
            padding: '.5rem 1rem',
        };

        const actionStyle = {
            textAlign: 'right',
        };

        const actionButtons = [];

        if (details.canCreate) {
            actionButtons.push(
                <IconButton
                    key="add"
                    iconClassName="material-icons"
                    tooltip={this.getTranslation('add')}
                    tooltipPosition="top-center"
                    onClick={details.add}
                >&#xE145;</IconButton>
            );
        }

        actionButtons.push(
            <IconButton
                key="list"
                iconClassName="material-icons"
                tooltip={this.getTranslation('list')}
                tooltipPosition="top-center"
                onClick={details.list}
            >&#xE8EF;</IconButton>
        );

        return (
            <Card key={index} style={cardStyle}>
                <CardHeader
                    onClick={details.list}
                    style={headerStyle}
                    title={details.name}
                    avatar={<span style={{ display: 'none' }} />}
                />
                <CardText style={textStyle}>{details.description}</CardText>
                <CardActions style={actionStyle}>
                    {actionButtons}
                </CardActions>
            </Card>
        );
    },

    render() {
        return (
            <div>
                {this.props.menuItems.map(this.renderCard)}
                <div style={{ clear: 'both' }}></div>
            </div>
        );
    },
});
