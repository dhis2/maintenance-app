import React from 'react';
import classes from 'classnames';

import FontIcon from 'material-ui/lib/font-icon';

import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';

export default React.createClass({
    propTypes: {
        fields: React.PropTypes.array,
        showDetailBox: React.PropTypes.bool,
        source: React.PropTypes.object,
        onClose: React.PropTypes.func,
    },

    mixins: [Translate],

    getDefaultProps() {
        return {
            fields: [
                'name',
                'shortName',
                'code',
                'displayDescription',
                'created',
                'lastUpdated',
                'id',
                'href',
            ],
            showDetailBox: false,
            onClose: () => {},
        };
    },

    getDetailBoxContent() {
        if (!this.props.source) {
            return (
                <div className="detail-box__status">Loading details...</div>
            );
        }

        return this.props.fields
            .filter(fieldName => this.props.source[fieldName])
            .map(fieldName => {
                const valueToRender = this.getValueToRender(fieldName, this.props.source[fieldName]);

                return (
                    <div key={fieldName} className="detail-field">
                        <div className={`detail-field__label detail-field__${fieldName}-label`}>{this.getTranslation(camelCaseToUnderscores(fieldName))}</div>
                        <div className={`detail-field__value detail-field__${fieldName}`}>{valueToRender}</div>
                    </div>
                );
            });
    },

    getValueToRender(fieldName, value) {
        const getDateString = dateValue => {
            const stringifiedDate = new Date(dateValue).toString();

            return stringifiedDate === 'Invalid Date' ? dateValue : stringifiedDate;
        };

        if (Array.isArray(value) && value.length) {
            const namesToDisplay = value
                .map(v => v.displayName ? v.displayName : v.name)
                .filter(name => name);

            return (
                <ul>
                    {namesToDisplay.map(name => <li key={name}>{name}</li>)}
                </ul>
            );
        }

        if (fieldName === 'created' || fieldName === 'lastUpdated') {
            return getDateString(value);
        }

        if (fieldName === 'href') {
            // Suffix the url with the .json extension to always get the json representation of the api resource
            return <a style={{ wordBreak: 'break-all' }} href={`${value}.json`} target="_blank">{value}</a>;
        }

        return value;
    },

    render() {
        const classList = classes('details-box');

        if (this.props.showDetailBox === false) {
            return null;
        }

        return (
            <div className={classList}>
                <FontIcon className="details-box__close-button material-icons" onClick={this.props.onClose}>close</FontIcon>
                <div>
                    {this.getDetailBoxContent()}
                </div>
            </div>
        );
    },

});
