import React from 'react';
import { UploadIconField } from '../../forms/form-fields/upload-icon-field.js';
import TextField from 'material-ui/TextField/TextField';
import FieldWrapper from '../../forms/form-fields/helpers/FieldWrapper.js';
import PropTypes from 'prop-types';

const UploadIconFormField = (props, { d2 }) => {
    const model = props.model;

    const onChange = event => {
        const file = event.target.files[0];
        if (file) {
            model.file = file;
            model.key = file.name
                .replace(/\..*$/, '')
                .replaceAll(/[-\s()]/g, '_');

            // this is not really used, because we're using "file"-property
            // when uploading. However this is used to give the field a value
            // to eg. indicate that a file is uploaded to "required"-validation
            const fileResource = {
                id: model.key,
            };
            props.onChange({ target: { value: fileResource } });
        }
    };
    // this means that image is uploaded, and we're in edit
    // just show the image
    if (model.href) {
        return (
            <FieldWrapper label={d2.i18n.getTranslation('icon')} hideDivider>
                <img alt={`icon ${model.key}`} src={model.href} width={48} />
            </FieldWrapper>
        );
    }
    return (
        <div style={{ paddingBlockStart: '16px' }}>
            <UploadIconField {...props} onChange={onChange} />
        </div>
    );
};

UploadIconFormField.contextTypes = {
    d2: PropTypes.object,
};

const Keywords = (props, { d2 }) => {
    const defaultValue = props.value && props.value.join(', ');

    const handleChange = event => {
        const keywords = event.target.value
            .split(/[,\r\n]+/)
            .map(kw => kw.trim())
            .filter(kw => !!kw);
        props.onChange({ target: { value: keywords } });
    };

    return (
        <TextField
            name="keywords"
            floatingLabelText={d2.i18n.getTranslation('keywords')}
            multiLine
            fullWidth
            defaultValue={defaultValue}
            hintText={d2.i18n.getTranslation('separate_keywords_by')}
            onChange={handleChange}
        />
    );
};

Keywords.contextTypes = {
    d2: PropTypes.object,
};

export default new Map([
    [
        'fileResource',
        {
            component: UploadIconFormField,
        },
    ],
    [
        'keywords',
        {
            component: Keywords,
        },
    ],
]);
