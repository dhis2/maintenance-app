import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';

const format = 'json';

const compressions = {
    zip: 'Zip',
    gz: 'Gzip',
    none: 'Uncompressed',
};

const styles = {
    dialog: {
        width: '45%',
    },
    checkbox: {
        marginTop: '20px',
    },
    downloadCount: {
        marginTop: '8px',
    },
    downloadFormat: {
        display: 'inline-block',
    },
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
            compression: 'zip',
            skipSharing: false,
        };
        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.metadataEndpoint = `${context.d2.Api.getApi().baseUrl}/metadata`;
    }

    handleChange = (prop, evt, index, value) => {
        this.setState({ [prop]: value });
    };

    getDownloadUrl() {
        const { compression, skipSharing } = this.state;
        const { queryParamFilters, pluralName } = this.props;

        const compressionStr = compression !== 'none' ? `.${compression}` : '';

        const filtersStr =
            queryParamFilters.length > 0
                ? `&filter=${queryParamFilters.join('&filter=')}`
                : '';

        let url = `${
            this.metadataEndpoint
        }.${format}${compressionStr}?download=true&skipSharing=${skipSharing}&${pluralName}=true${filtersStr}`;

        return url;
    }

    renderForm() {
        return (
            <div>
                <span style={styles.downloadFormat}>
                    {this.t('download_format_json')}
                </span>
                <SelectField
                    value={this.state.compression}
                    onChange={this.handleChange.bind(this, 'compression')}
                    floatingLabelText={this.t('compression')}
                    fullWidth
                >
                    {Object.keys(compressions).map(compr => (
                        <MenuItem
                            value={compr}
                            primaryText={compressions[compr]}
                            key={compr}
                        />
                    ))}
                </SelectField>
                <Checkbox
                    label={this.t('with_sharing')}
                    checked={!this.state.skipSharing}
                    style={styles.checkbox}
                    onCheck={(_, isChecked) =>
                        this.setState({ skipSharing: !isChecked })
                    }
                />
            </div>
        );
    }

    renderDownloadCount() {
        const { objectCount, name, pluralName } = this.props;
        let displayName = objectCount !== 1 ? pluralName : name;
        const modelTypeStr = this.t(
            camelCaseToUnderscores(displayName)
        ).toLowerCase();

        const str = this.t('the_download_contains_$$total$$_$$modelType$$', {
            total: objectCount,
            modelType: modelTypeStr,
        });

        return <p style={styles.downloadCount}>{str}</p>;
    }
    render() {
        const actions = [
            <FlatButton
                label={this.t('cancel')}
                primary={true}
                onClick={this.props.defaultCloseDialog}
            />,
            <a download="test" href={this.getDownloadUrl()}>
                <FlatButton
                    label={this.t('download')}
                    primary={true}
                    onClick={this.props.defaultCloseDialog}
                />
            </a>,
        ];
        return (
            <Dialog
                open={this.props.open}
                actions={actions}
                title={this.t('download_metadata')}
                onRequestClose={this.props.defaultCloseDialog}
                contentStyle={styles.dialog}
                autoScrollBodyContent
            >
                {this.renderDownloadCount()}
                {this.renderForm()}
            </Dialog>
        );
    }
}
