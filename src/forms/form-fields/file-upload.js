import React from 'react/addons';
import log from 'loglevel';

import LinearProgress from 'material-ui/lib/linear-progress';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';

import Translate from 'd2-ui/lib/i18n/Translate.mixin';

import Checkbox from 'material-ui/lib/checkbox';
import AppTheme from '../theme';

export default React.createClass({
    propTypes: {
        name: React.PropTypes.oneOf(['logo_front', 'logo_banner']).isRequired,
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.bool.isRequired,
        defaultValue: React.PropTypes.bool.isRequired,
        isEnabled: React.PropTypes.bool.isRequired,

        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
    },

    mixins: [Translate],

    getInitialState() {
        return {
            isEnabled: this.props.isEnabled,
            uploading: false,
            progress: undefined,
        };
    },

    renderUploading() {
        const progressStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 1,
        };

        return (
            <div>
                <FlatButton label={this.getTranslation('cancel_upload')} onClick={this._fileClick} />
                <div style={progressStyle}>
                    <LinearProgress mode={this.state.progress ? 'determinate' : 'indeterminate'} value={this.state.progress}/>
                </div>
            </div>
        );
    },

    renderUpload() {
        const bodyStyle = {
            backgroundColor: AppTheme.rawTheme.palette.accent1Color,
            textAlign: 'center',
            overflow: 'auto',
            padding: 48,
        };

        const apiBase = this.context.d2.Api.getApi().baseUrl;
        const imgUrl = [apiBase, 'staticContent', this.props.name].join('/');

        if (this.state.isEnabled) {
            return (
                <div>
                    <FlatButton label={this.getTranslation('replace_image')} secondary onClick={this._fileClick} />
                    <FlatButton label={this.getTranslation('preview_image')} onClick={this._previewClick} />
                    <Dialog ref="dialog"
                            autoDetectWindowHeight
                            autoScrollBodyContent
                            bodyStyle={bodyStyle}>
                        <img src={imgUrl} />
                    </Dialog>
                </div>
            );
        }

        return (
            <FlatButton label={this.getTranslation('upload_image')} primary onClick={this._fileClick} />
        );
    },

    render() {
        const {onFocus, onBlur, onChange, ...other} = this.props;

        const containerStyle = {
            position: 'relative',
            display: 'block',
            whiteSpace: 'nowrap',
        };

        const checkStyle = {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8,
        };

        const btnStyle = {
            display: 'inline-block',
            position: 'absolute',
            top: 2,
        };

        return (
            <div style={containerStyle}>
                <div style={checkStyle}>
                    <Checkbox label={this.props.label}
                              onCheck={this._check}
                              disabled={!this.state.isEnabled}
                              labelStyle={{color: AppTheme.rawTheme.palette.textColor}}
                              checked={this.props.value} />
                </div>
                <div style={btnStyle}>
                    { this.state.uploading ? this.renderUploading() : this.renderUpload() }
                    <input type="file"
                           style={{visibility: 'hidden', display: 'none'}}
                           ref={(ref) => this.fileInput = ref}
                           onChange={this._upload} />
                </div>
            </div>
        );
    },

    _fileClick(e) {
        if (this.fileInput && !this.state.uploading) {
            this.fileInput.getDOMNode().click(e);
        } else if (this.state.uploading) {
            this.xhr.abort();
            this.setState({uploading: false, progress: undefined});
            log.info('File upload cancelled');
        }
    },

    _previewClick() {
        this.refs.dialog.show();
    },

    _check(e) {
        this.props.onChange({target: {value: e.target.checked}});
    },

    _upload(e) {
        if (e.target.files.length === 0) {
            return;
        }

        this.setState({
            uploading: true,
            progress: undefined,
        });

        const api = this.context.d2.Api.getApi();
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (progress) => {
            if (progress.lengthComputable) {
                this.setState({progress: (progress.loaded / progress.total) * 100});
            } else {
                this.setState({progress: undefined});
            }
        };
        this.xhr = xhr;

        const data = new FormData();
        data.append('file', e.target.files[0]);

        api.post(['staticContent', this.props.name].join('/'), data, {
            contentType: false,
            processData: false,
            xhr: () => { return xhr; },
        }).then(() => {
            log.info('File uploaded successfully');
            this.props.onChange({target: {value: true}});
            this.setState({
                uploading: false,
                progress: undefined,
                isEnabled: true,
            });
        }).catch(() => {
            log.warn('File upload failed:', arguments);
            this.props.onChange({target: {value: false}});
            this.setState({
                uploading: false,
                progress: undefined,
                isEnabled: false,
            });
        });
    },
});
