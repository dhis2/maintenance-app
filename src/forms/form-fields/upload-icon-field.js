import React, { Component } from 'react';
import Button from 'd2-ui/lib/button/Button';
import PropTypes from 'prop-types';
import { fileToBase64 } from './helpers/fileToBase64.js';

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

export class UploadIconField extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            fileBase64: null,
        };

        this.fileInputRef = null;
    }

    setFileInputRef = element => {
        this.fileInputRef = element;
    };

    handleChooseFileClick = () => {
        if (this.fileInputRef) {
            this.fileInputRef.click();
        }
    };

    handleFileChange = async event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event);
        }
        // used to preview image
        // since this is async, we can't do it during render
        const fileBase64 = await fileToBase64(file);
        this.setState({
            fileBase64,
        });
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
        const accept = this.props.accept || 'image/png';
        const label =
            this.props.label ||
            this.context.d2.i18n.getTranslation('choose_file_to_upload');
        return (
            <div>
                <Button
                    onClick={this.handleChooseFileClick}
                    style={styles.selectFileButton}
                >
                    {this.state.fileBase64 &&
                        this.renderIconFromBase64(this.state.fileBase64)}

                    <span style={{ padding: '0 16px' }}>{label}</span>
                </Button>
                <input
                    type="file"
                    onChange={this.handleFileChange}
                    style={styles.iconFileInput}
                    ref={this.setFileInputRef}
                    accept={accept}
                />
            </div>
        );
    }
}

UploadIconField.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    accept: PropTypes.string,
};
UploadIconField.contextTypes = {
    d2: PropTypes.object,
};
