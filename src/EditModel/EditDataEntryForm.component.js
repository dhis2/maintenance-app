import React from 'react';

import Heading from 'd2-ui/lib/headings/Heading.component';

const styles = {
    heading: {
        paddingBottom: 18,
    },
};

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            formHtml: undefined,
        };

        const CKEDITOR = window.CKEDITOR || {};

        // TODO: Load all data elements, category option group sets and indicators for the data set
        context.d2.models.dataSets.get(props.params.modelId, {
            fields: 'displayName,dataEntryForm[:all]',
        }).then(dataSet => {
            this.setState({
                formTitle: dataSet.displayName,
                formHtml: EditDataEntryForm.processFormData(dataSet.dataEntryForm),
            }, () => {
                if (this.state.formHtml !== undefined) {
                    this._editor = CKEDITOR.replace('designTextarea', {
                        removePlugins: 'flash, iframe, smiley, save, templates',
                        allowedContent: true,
                        extraPlugins: 'autogrow',
                        autoGrow_onStartup: true,
                        autoGrow_minHeight: 500,
                    });
                    this._editor.setData(this.state.formHtml);
                }
            });
        });
    }

    static processFormData(formData) {
        const inHtml = formData.htmlCode || '';
        let outHtml = '';

        const inputPattern = /<input.*?\/>/gi;
        const idPattern = /id="(\w*?)-(\w*?)-val"/;
        const dataElementPattern = /dataelementid="(\w{11})"/;
        const indicatorPattern = /indicatorid="(\w{11})"/;

        let inputElement = inputPattern.exec(inHtml);
        let inPos = 0;
        while (inputElement !== null) {
            outHtml += inHtml.substr(inPos, inputElement.index - inPos);
            inPos = inputPattern.lastIndex;

            const inputHtml = inputElement[0];
            const idMatch = idPattern.exec(inputHtml);
            const dataElementTotalMatch = dataElementPattern.exec(inputHtml);
            const indicatorMatch = indicatorPattern.exec(inHtml);

            // TODO: Insert properly formatted input fields
            if (idMatch) {
                // const [, dataElementId, categoryOptionComboId] = idMatch;
                outHtml += '<span style="background:#ffeeee;white-space:nowrap;">Data Element</span>';
            } else if (dataElementTotalMatch) {
                outHtml += '<span style="background:#eeffee;white-space:nowrap;">Data Element Total</span>';
            } else if (indicatorMatch) {
                outHtml += '<span style="background:#eeeeff;white-space:nowrap;">Indicator</span>';
            } else {
                outHtml += inputHtml;
            }

            inputElement = inputPattern.exec(inHtml);
        }
        outHtml += inHtml.substr(inPos);

        return outHtml;
    }

    componentWillUnmount() {
        if (this._editor) {
            this._editor.destroy();
        }
    }

    render() {
        const editorStyle = {
            display: this.state.formHtml === undefined ? 'none' : 'block',
        };

        // TODO: Add dialog for finding and inserting data elements, data element totals, indicators and flags (?)
        // TODO: Add style setting
        // TODO: Autosaving

        return (
            <div>
                <Heading style={styles.heading}>
                    {this.state.formTitle} {this.context.d2.i18n.getTranslation('data_entry_form')}
                </Heading>
                <textarea id="designTextarea" name="designTextarea" style={editorStyle} />
            </div>
        );
    }
}
EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

export default EditDataEntryForm;
