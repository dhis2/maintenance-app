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
            width: '320px',
        };

        const headerStyle = {
            backgroundColor: '#86C5F9',
            padding: '1rem',
            height: 'auto',
        };

        const textStyle = {
            height: '145px',
            padding: '.5rem 1rem',
        };

        const actionStyle = {
            textAlign: 'right',
        };

        return (
            <Card key={index} style={cardStyle}>
                <CardHeader style={headerStyle} title={details.name} avatar={<span style={{display: 'none'}} />} />
                <CardText style={textStyle}>{details.description}</CardText>
                <CardActions style={actionStyle}>
                    {details.canCreate ? <IconButton
                        iconClassName="material-icons"
                        tooltip={this.getTranslation('add')}
                        tooltipPosition="top-center"
                        onClick={details.add}>
                        &#xE145;
                    </IconButton> : null}
                    <IconButton
                        iconClassName="material-icons"
                        tooltip={this.getTranslation('list')}
                        tooltipPosition="top-center"
                        onClick={details.list}>
                        &#xE8EF;
                    </IconButton>
                </CardActions>
            </Card>
        );
    },

    render() {
        const wrapStyle = {
            paddingTop: '3rem',
        };

        return (
            <div style={wrapStyle}>
                <div>
                    {this.props.menuItems.map(this.renderCard)}
                </div>
            </div>
        );
    },
});
