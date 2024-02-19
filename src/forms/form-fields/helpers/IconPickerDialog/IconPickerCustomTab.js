import React, { Component } from 'react';
import Button from 'd2-ui/lib/button/Button';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField/TextField';
import { fileToBase64 } from './fileToBase64.js';

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
    },
    iconForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    uploadButton: {
        alignSelf: 'center',
        backgroundColor: '#ff9800',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        minWidth: 129,
        height: 36,
        lineHeight: 2.5,
        marginTop: 24,
        boxShadow: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
        cursor: 'pointer',
    },
    iconFileInput: {
        display: 'none',
    },
    iconsWrapper: {},
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
        };
    }

    handleIconMetadataChange = event => {
        console.log({
            event,
            value: event.target.value,
            name: event.target.name,
        });
        let value = event.target.value;
        const name = event.target.name;
        if (!value) {
            return;
        }
        value = value.trim();
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
        const formData = new FormData();
        formData.append('file', this.state.iconFile);
        formData.append('domain', 'CUSTOM_ICON');

        const iconData = {
            ...this.state.iconMetadata,
        };

        const fileResourceId = this.d2.Api.getApi()
            .post('/fileResources', formData)
            .then(response => response.response.fileResource.id)
            .then(fileResourceId => {
                const data = {
                    fileResourceUid: fileResourceId,
                    ...iconData,
                };
                return this.d2.Api.getApi().post('/icons', data);
            })
            .then(res => {
                if (typeof this.props.onIconUpload === 'function') {
                    this.props.onIconUpload(iconData.key);
                }
            });
    };

    handleFileChange = async event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        // used to preview image
        // since this is async, we can't do it during render
        const iconFileBase64 = await fileToBase64(file);

        this.setState({
            iconFile: file,
            iconFileBase64,
        });
    };

    handleSelectUploadIcon = () => {
        this.refs.iconFileInput.click();
    };

    renderIconFromFile = () => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        const fallbackIconPath = `${contextPath}/api/icons/dhis2_logo_outline/icon.svg`;
        return (
            <img
                src={this.state.iconFileBase64}
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
        return (
            <div style={styles.wrapper}>
                <div style={styles.iconForm}>
                    <div>
                        <Button
                            onClick={this.handleSelectUploadIcon}
                            style={{
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                textAlign: 'center',
                                position: 'relative',
                                minWidth: 129,
                                height: 36,
                                lineHeight: 2.5,
                                marginTop: 10,
                                boxShadow:
                                    '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                            }}
                        >
                            {this.state.iconFileBase64 &&
                                this.renderIconFromFile()}

                            <span style={{ padding: '0 16px' }}>
                                {this.state.iconFile
                                    ? this.context.d2.i18n.getTranslation(
                                          'change_icon'
                                      )
                                    : this.context.d2.i18n.getTranslation(
                                          'upload_icon'
                                      )}
                            </span>
                        </Button>
                    </div>
                    <input
                        type="file"
                        onChange={this.handleFileChange}
                        style={styles.iconFileInput}
                        ref="iconFileInput"
                        accept="image/png"
                    />
                    <TextField
                        name="key"
                        onChange={this.handleIconMetadataChange}
                        floatingLabelText="Icon Key"
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
                    />

                    <Button
                        style={styles.uploadButton}
                        onClick={this.handleFileUpload}
                    >
                        {this.t('upload_custom_icon')}
                    </Button>
                </div>
                <Divider />
                <div>{this.props.children}</div>
            </div>
        );
    }
}

IconPickerCustomTab.propTypes = {
    children: PropTypes.node,
    onIconUpload: PropTypes.function,
};

IconPickerCustomTab.contextTypes = {
    d2: PropTypes.object,
};
