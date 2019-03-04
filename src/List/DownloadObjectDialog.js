import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';

const formats = {
    json: 'JSON',
    xml: 'XML',
    csv: 'CSV',
};

const compressions = {
    zip: 'Zip',
    gz: 'Gzip',
    none: 'Uncompressed',
};

export default class DownloadObjectDialog extends Component {
    static propTypes = {
        queryParamFilters: PropTypes.array,
        defaultCloseDialog: PropTypes.func,
    };

    static contextTypes = {
        d2: PropTypes.object,
    };

    constructor(props, context) {
        super(props);

        this.state = {
            format: 'json',
            compression: 'zip',
        };
        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.metadataEndpoint = `${context.d2.Api.getApi().baseUrl}/metadata`;
    }

    handleChange = (prop, evt, index, value) => {
        this.setState({ [prop]: value });
    };

    handleChangeFormat = (evt, index, value) => {};

    handleDownload = () => {
        const { format, compression } = this.state;
        const { queryParamFilters, pluralName } = this.props;

        const compressionStr = compression !== 'none' ? `.${compression}` : '';

        const filtersStr =
            queryParamFilters.length > 0
                ? `&filter=${queryParamFilters.join('&filter=')}`
                : '';

        let url = `${
            this.metadataEndpoint
        }.${format}${compressionStr}?${pluralName}=true${filtersStr}`;

        window.location = url;
        this.props.defaultCloseDialog();
    };

    renderForm() {
        return (
            <div>
                <SelectField
                    value={this.state.format}
                    onChange={this.handleChange.bind(this, 'format')}
                    floatingLabelText={this.t('format')}
                >
                    {Object.keys(formats).map(format => (
                        <MenuItem
                            value={format}
                            primaryText={formats[format]}
                            key={format}
                        />
                    ))}
                </SelectField>
                <SelectField
                    value={this.state.compression}
                    onChange={this.handleChange.bind(this, 'compression')}
                    floatingLabelText={this.t('compression')}
                >
                    {Object.keys(compressions).map(compr => (
                        <MenuItem
                            value={compr}
                            primaryText={compressions[compr]}
                            key={compr}
                        />
                    ))}
                </SelectField>
            </div>
        );
    }

    renderDownloadCount() {
        const { objectCount, name, pluralName } = this.props;
        let displayName = objectCount !== 1 ? pluralName : name;
        const modelTypeStr = this.t(camelCaseToUnderscores(displayName));

        const str = this.t('the_download_contains_$$total$$_$$modelType$$', {
            total: objectCount,
            modelType: modelTypeStr,
        });
        return <p>{str}.</p>;
    }
    render() {
        const actions = [
            <FlatButton
                label={this.t('cancel')}
                primary={true}
                onClick={this.props.defaultCloseDialog}
            />,
            <FlatButton
                label={this.t('download')}
                primary={true}
                onClick={this.handleDownload}
            />,
        ];
        return (
            <Dialog
                open={this.props.open}
                actions={actions}
                title={this.t('download_metadata')}
                onRequestClose={this.props.defaultCloseDialog}
            >
                {this.renderForm()}
                {this.renderDownloadCount()}
            </Dialog>
        );
    }
}
