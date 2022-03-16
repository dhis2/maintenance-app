import React, { Component } from 'react';
import PropTypes from 'prop-types';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import classes from 'classnames';

class DataTableHeader extends Component {
    constructor(props, context) {
        super(props, context);

        const i18n = this.context.d2.i18n;
        this.getTranslation = i18n.getTranslation.bind(i18n);
    }

    render() {
        const classList = classes(
            'data-table__headers__header',
            {
                'data-table__headers__header--even': !this.props.isOdd,
                'data-table__headers__header--odd': this.props.isOdd,
            },
        );

        return (
            <div className={classList}>
                {this.props.name ? this.getTranslation(camelCaseToUnderscores(this.props.name)) : null}
                {this.props.children}
            </div>
        );
    }
}

DataTableHeader.propTypes = {
    isOdd: PropTypes.bool,
    name: PropTypes.string,
};

DataTableHeader.contextTypes = {
    d2: PropTypes.object,
};

export default DataTableHeader;
