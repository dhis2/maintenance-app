import React from 'react';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import Heading from 'd2-ui/lib/headings/Heading.component';

export default React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        level: React.PropTypes.number,
    },

    mixins: [Translate],

    render() {
        return (
            <Heading level={this.props.level || 2} text={this.getTranslation(this.props.text)} />
        );
    },
});
