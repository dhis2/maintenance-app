import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField/TextField';
import { uploadIcon } from './uploadIcon.js';
import ErrorMessage from 'd2-ui/lib/messages/ErrorMessage.component';
import classes from 'classnames';
import { UploadIconField } from '../../upload-icon-field.js';

export class IconPickerCustomTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.d2 = context.d2;
        this.state = {
            iconFile: null,
            iconMetadata: {
                key: '',
                description: '',
                keywords: [],
            },
            uploading: false,
            uploadError: null,
        };
    }

    handleIconMetadataChange = event => {
        const value = event.target.value && event.target.value.trim();
        const name = event.target.name;

        this.setState(prevState => ({
            iconMetadata: {
                ...prevState.iconMetadata,
                [name]: value,
            },
        }));
    };

    handleIconKeywordsChange = event => {
        const keywords = event.target.value
            .split(/[,\r\n]+/)
            .map(kw => kw.trim())
            .filter(kw => !!kw);
        this.setState(prevState => ({
            iconMetadata: {
                ...prevState.iconMetadata,
                keywords,
            },
        }));
    };

    handleFileUpload = () => {
        const iconData = this.state.iconMetadata;
        this.setState({ uploading: true });
        uploadIcon(this.state.iconFile, iconData)
            .then(() => {
                if (typeof this.props.onIconUpload === 'function') {
                    this.props.onIconUpload(iconData.key);
                }
                this.setState({ uploading: false, uploadError: null });
            })
            .catch(e => this.setState({ uploading: false, uploadError: e }));
    };

    handleFileChange = async event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        this.setState(prevState => ({
            iconFile: file,
            iconMetadata: {
                ...prevState.iconMetadata,
                // remove file extension and replace hyphens with underscores
                key: file.name.replace(/\..*$/, '').replaceAll(/[-\s()]/g, '_'),
            },
        }));
    };

    render() {
        const iconKey = this.state.iconMetadata.key;

        return (
            <div className={classes('icon-picker-custom', 'wrapper')}>
                <div className={'form'}>
                    <UploadIconField onChange={this.handleFileChange} />
                    {this.state.iconFile && (
                        <div className="form-fields">
                            <TextField
                                name="key"
                                onChange={this.handleIconMetadataChange}
                                floatingLabelText={this.t("key")}
                                value={iconKey}
                                required
                            />
                            <TextField
                                name="description"
                                onChange={this.handleIconMetadataChange}
                                floatingLabelText={this.t('description')}
                            />
                            <TextField
                                name="keywords"
                                onChange={this.handleIconKeywordsChange}
                                floatingLabelText={this.t('keywords')}
                                multiLine
                                hintText={this.t('separate_keywords_by')}
                            />
                            {this.state.uploadError && (
                                <ErrorMessage
                                    message={this.state.uploadError.message}
                                />
                            )}
                            <RaisedButton
                                className="upload-button"
                                onClick={this.handleFileUpload}
                                label={this.t('upload_icon')}
                                primary
                                disabled={this.state.uploading || !this.state.iconMetadata.key}
                            />
                        </div>
                    )}
                </div>
                <Divider />
                <div>{this.props.children}</div>
            </div>
        );
    }
}

IconPickerCustomTab.propTypes = {
    children: PropTypes.node,
    onIconUpload: PropTypes.func,
};

IconPickerCustomTab.contextTypes = {
    d2: PropTypes.object,
};
