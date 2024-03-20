import React, { Component } from 'react';
import Button from 'd2-ui/lib/button/Button';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField/TextField';
import { fileToBase64 } from './fileToBase64.js';
import { uploadIcon } from './uploadIcon.js';
import ErrorMessage from 'd2-ui/lib/messages/ErrorMessage.component';
import classes from 'classnames';

const styles = {
    selectFileButton: {
        backgroundColor: '#ff9800',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        minWidth: 129,
        height: 36,
        lineHeight: 2.5,
        boxShadow: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        textTransform: 'uppercase',
    },
    iconFileInput: {
        display: 'none',
    },
};

export class IconPickerCustomTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.d2 = context.d2;
        this.state = {
            iconFile: null,
            iconFileBase64: null,
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
            .split(',')
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

        // used to preview image
        // since this is async, we can't do it during render
        const iconFileBase64 = await fileToBase64(file);

        this.setState(prevState => ({
            iconFile: file,
            iconFileBase64,
            iconMetadata: {
                ...prevState.iconMetadata,
                // remove file extension and replace hyphens with underscores
                key: file.name.replace(/\..*$/, '').replaceAll('-', '_'),
            },
        }));
    };

    handleSelectUploadIcon = () => {
        this.refs.iconFileInput.click();
    };

    renderIconFromBase64 = srcBase64 => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        const fallbackIconPath = `${contextPath}/api/icons/dhis2_logo_outline/icon.svg`;
        return (
            <img
                src={srcBase64}
                alt={altText}
                className="icon-picker__icon-button-image"
                style={{ backgroundColor: 'white', overflow: 'hidden' }}
                onError={({ target }) => {
                    target.onerror = '';
                    target.src = fallbackIconPath;
                    return true;
                }}
            />
        );
    };

    render() {
        const iconKey = this.state.iconMetadata.key;

        return (
            <div className={classes('icon-picker-custom', 'wrapper')}>
                <div className={'form'}>
                    <div>
                        <Button
                            onClick={this.handleSelectUploadIcon}
                            style={styles.selectFileButton}
                        >
                            {this.state.iconFileBase64 &&
                                this.renderIconFromBase64(
                                    this.state.iconFileBase64
                                )}

                            <span style={{ padding: '0 16px' }}>
                                {this.context.d2.i18n.getTranslation(
                                    'choose_file_to_upload'
                                )}
                            </span>
                        </Button>
                        <input
                            type="file"
                            onChange={this.handleFileChange}
                            style={styles.iconFileInput}
                            ref="iconFileInput"
                            accept="image/png"
                        />
                    </div>
                    {this.state.iconFile && (
                        <div className="form-fields">
                            <TextField
                                name="key"
                                onChange={this.handleIconMetadataChange}
                                floatingLabelText="Icon Key"
                                value={iconKey}
                            />
                            <TextField
                                name="description"
                                onChange={this.handleIconMetadataChange}
                                floatingLabelText="Description"
                            />
                            <TextField
                                name="keywords"
                                onChange={this.handleIconKeywordsChange}
                                floatingLabelText="Keywords"
                                multiLine
                                hintText="Separate keywords by ,"
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
                                disabled={this.state.uploading}
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
