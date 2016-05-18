import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import Heading from 'd2-ui/lib/headings/Heading.component';

const styles = {
    heading: {
        paddingBottom: 18,
    },
    formSection: {
        marginTop: 28,
    },
    cancelButton: {
        marginLeft: 14,
    },
};

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            formTitle: undefined,
            formHtml: undefined,
        };

        const CKEDITOR = window.CKEDITOR || {};

        // TODO: Load all data elements, category option group sets and indicators for the data set
        Promise.all([
            context.d2.models.dataSets.get(props.params.modelId, {
                fields: 'displayName,dataEntryForm[:all]',
            }),
            // context.d2.models.dataElementOperands.list({
            //     paging: false,
            //     fields: 'displayName,:all',
            // }),
            context.d2.Api.getApi().get('dataElementOperands', {
                paging: false,
                totals: true,
                fields: 'id,displayName',
            }),
        ]).then(([
            dataSet,
            ops,
        ]) => {
            this.operands = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') !== -1)
                .reduce((out, op) => {
                    const id = `${op.id.split('.').join('-')}-val`;
                    out[id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            this.totals = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') === -1)
                .reduce((out, op) => {
                    out[op.id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            const formHtml = dataSet.dataEntryForm ? this.processFormData(dataSet.dataEntryForm) : '';
            const formStyle = dataSet.dataEntryForm && dataSet.dataEntryForm.formStyle || 'NORMAL';

            this.setState({
                formTitle: dataSet.displayName,
                formHtml,
                formStyle,
            }, () => {
                if (this.state.formHtml !== undefined) {
                    this._editor = CKEDITOR.replace('designTextarea', {
                        removePlugins: 'scayt,wsc,about',
                        allowedContent: true,
                        extraPlugins: 'preview,div',
                        autoGrow_onStartup: true,
                        autoGrow_minHeight: 500,
                        disableNativeSpellChecked: false,
                        height: 500,
                    });
                    this._editor.setData(this.state.formHtml);
                }
            });
        });

        this.changeStyle = this.changeStyle.bind(this);
    }

    componentWillUnmount() {
        if (this._editor) {
            this._editor.destroy();
        }
    }

    processFormData(formData) {
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
            const inputStyle = (/style="(.*?)"/.exec(inputHtml) || ['', ''])[1];

            const idMatch = idPattern.exec(inputHtml);
            const dataElementTotalMatch = dataElementPattern.exec(inputHtml);
            const indicatorMatch = indicatorPattern.exec(inHtml);

            // TODO: Insert properly formatted input fields
            if (idMatch) {
                const [, dataElementId, categoryOptionComboId] = idMatch;
                const id = `${dataElementId}-${categoryOptionComboId}-val`;
                const label = this.operands && this.operands[id];
                outHtml += `<input id="${id}" name="entryfield" title="${label}" value="[ ${label} ]" style="${inputStyle}"/>`;
            } else if (dataElementTotalMatch) {
                const dataElementTotalId = dataElementTotalMatch[1];
                const label = this.totals && this.totals[dataElementTotalId];
                outHtml += `<input dataelementid="${dataElementTotalId}" id="total${dataElementTotalId}" name="total" readonly="readonly" title="${label}" value="[ ${label} ]" style="${inputStyle}"/>`;
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

    render() {
        const editorStyle = {
            display: this.state.formHtml === undefined ? 'none' : 'block',
        };

        // TODO: Add dialog for finding and inserting data elements, data element totals, indicators and flags (?)
        // TODO: Add style setting
        // TODO: Autosaving
        // TODO: Add loading mask

        return (
            <div>
                <Heading style={styles.heading}>
                    {this.state.formTitle} &mdash; {this.context.d2.i18n.getTranslation('data_entry_form')}
                </Heading>
                <textarea id="designTextarea" name="designTextarea" style={editorStyle} />
                <div style={styles.formSection}>
                    <SelectField value={this.state.formStyle} floatingLabelText="Form display style" onChange={this.changeStyle}>
                        <MenuItem value={'NORMAL'} primaryText="Normal" />
                        <MenuItem value={'COMFORTABLE'} primaryText="Comfortable" />
                        <MenuItem value={'COMPACT'} primaryText="Compact" />
                        <MenuItem value={'NONE'} primaryText="None" />
                    </SelectField>
                </div>
                <div style={styles.formSection}>
                    <RaisedButton label="Save" primary/>
                    <FlatButton label="Cancel" style={styles.cancelButton}/>
                </div>
            </div>
        );
    }

    changeStyle(e, i, value) {
        this.setState({
            formStyle: value,
        });
    }
}
EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

export default EditDataEntryForm;
