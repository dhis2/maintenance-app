import React from 'react';
import log from 'loglevel';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Paper from 'material-ui/lib/paper';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';

const styles = {
    heading: {
        paddingBottom: 18,
    },
    formPaper: {
        width: '100%',
        margin: '0 auto 2rem',
        padding: '1px 4rem 4rem',
        position: 'relative',
    },
    formSection: {
        marginTop: 28,
    },
    cancelButton: {
        marginLeft: '2rem',
    },
    palette: {
        position: 'absolute',
        left: 16,
        top: 174,
        bottom: 8,
        width: 279,
        background: 'white',
        borderRadius: 5,
        padding: 16,
        fontSize: 12,
        overflow: 'auto',
        whiteSpace: 'nowrap',
    },
    paletteHeader: {
        fontWeight: 700,
        display: 'block',
        fontSize: 16,
        marginLeft: -8,
    },
};

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        const CKEDITOR = window.CKEDITOR || {};
        this.state = {};

        // TODO: Use d2.models when dataElementOperands are properly supported
        Promise.all([
            context.d2.models.dataSets.get(props.params.modelId, {
                fields: 'displayName,dataEntryForm[style,htmlCode],indicators[id,displayName]',
            }),
            context.d2.Api.getApi().get('dataElementOperands', {
                paging: false,
                totals: true,
                fields: 'id,displayName',
            }),
        ]).then(([
            dataSet,
            ops,
        ]) => {
            const operands = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') !== -1)
                .reduce((out, op) => {
                    const id = `${op.id.split('.').join('-')}-val`;
                    out[id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            const totals = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') === -1)
                .reduce((out, op) => {
                    out[op.id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            const indicators = dataSet.indicators.toArray()
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .reduce((out, i) => {
                    out[i.id] = i.displayName; // eslint-disable-line
                    return out;
                }, {});

            this.setState({
                formTitle: dataSet.displayName,
                formHtml: dataSet.dataEntryForm || '',
                formStyle: dataSet.dataEntryForm && dataSet.dataEntryForm.formStyle || 'NORMAL',
                operands,
                totals,
                indicators,
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
                    this._editor.setData(this.processFormData(this.state.formHtml));
                }
            });
        });

        this.saveClick = this.saveClick.bind(this);
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
            const inputDisabled = /disabled/.exec(inputHtml) !== null;

            const idMatch = idPattern.exec(inputHtml);
            const dataElementTotalMatch = dataElementPattern.exec(inputHtml);
            const indicatorMatch = indicatorPattern.exec(inHtml);

            // TODO: Insert properly formatted input fields
            if (idMatch) {
                outHtml += this.getHtml(`${idMatch[1]}-${idMatch[2]}-val`, inputStyle, inputDisabled);
            } else if (dataElementTotalMatch) {
                outHtml += this.getHtml(dataElementTotalMatch[1], inputStyle, inputDisabled);
            } else if (indicatorMatch) {
                outHtml += this.getHtml(indicatorMatch[1], inputStyle, inputDisabled);
            } else {
                outHtml += inputHtml;
            }

            inputElement = inputPattern.exec(inHtml);
        }
        outHtml += inHtml.substr(inPos);

        return outHtml;
    }

    render() {
        // TODO: Add dialog for finding and inserting data elements, data element totals, indicators and flags (?)
        // TODO: Autosaving

        return this.state.formHtml === undefined ? <LoadingMask /> : (
            <div>
                <Heading style={styles.heading}>
                    {this.state.formTitle} {this.context.d2.i18n.getTranslation('data_entry_form')}
                </Heading>
                <div style={styles.palette}>
                    <div style={styles.paletteHeader}>Operands:</div>
                    {Object.keys(this.state.operands).map(op => (
                        <div key={op}>
                            <a title={`Click to insert input field for \"${this.state.operands[op]}\"`}
                                onClick={this.insertOperand.bind(this, op)}
                            >{this.state.operands[op]}</a>
                        </div>
                    ))}
                    <div style={styles.paletteHeader}>Totals:</div>
                    {Object.keys(this.state.totals).map(t => (
                        <div key={t}>
                            <a title={`Click to insert input field for \"${this.state.totals[t]}\"`}
                                onClick={this.insertTotal.bind(this, t)}
                            >{this.state.totals[t]}</a>
                        </div>
                    ))}
                    <div style={styles.paletteHeader}>Indicators:</div>
                    {Object.keys(this.state.indicators).map(i => (
                        <div key={i}>
                            <a title={`Click to insert input field for \"${this.state.indicators[i]}\"`}
                                onClick={this.insertIndicator.bind(this, i)}
                            >{this.state.indicators[i]}</a>
                        </div>
                    ))}
                </div>
                <textarea id="designTextarea" name="designTextarea"/>
                <Paper style={styles.formPaper}>
                    <div style={styles.formSection}>
                        <SelectField
                            value={this.state.formStyle}
                            floatingLabelText="Form display style"
                            onChange={this.changeStyle}
                        >
                            <MenuItem value={'NORMAL'} primaryText="Normal"/>
                            <MenuItem value={'COMFORTABLE'} primaryText="Comfortable"/>
                            <MenuItem value={'COMPACT'} primaryText="Compact"/>
                            <MenuItem value={'NONE'} primaryText="None"/>
                        </SelectField>
                    </div>
                    <div style={styles.formSection}>
                        <RaisedButton label="Save" primary onClick={this.saveClick}/>
                        <FlatButton label="Cancel" style={styles.cancelButton}/>
                    </div>
                </Paper>
            </div>
        );
    }

    getHtml(id, styleAttr, disabledAttr) {
        const style = styleAttr ? ` style=${styleAttr}` : '';
        const disabled = disabledAttr ? ' disabled="disabled"' : '';

        if (id.indexOf('-') !== -1) {
            const label = this.state.operands && this.state.operands[id];
            const attr = `name="entryfield" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input id="${id}" ${attr}/>`;
        } else if (this.state.totals.hasOwnProperty(id)) {
            const label = this.state.totals[id];
            const attr = `name="total" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input dataelementid="${id}" id="total${id}" name="total" ${attr}/>`;
        } else if (this.state.indicators.hasOwnProperty(id)) {
            const label = this.state.indicators[id];
            const attr = `name="indicator" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input indicatorid="${id}" id="indicator${id}" ${attr}/>`;
        }

        log.warn('Failed to generate HTML for ID:', id);
        return '';
    }

    insertOperand(id) {
        this._editor.insertHtml(this.getHtml(id), 'unfiltered_html');
    }

    insertTotal(id) {
        this._editor.insertHtml(this.getHtml(id), 'unfiltered_html');
    }

    insertIndicator(id) {
        this._editor.insertHtml(this.getHtml(id), 'unfiltered_html');
    }

    saveClick(e) {
        console.warn(this._editor.getData());
    }

    changeStyle(e, i, value) {
        this.setState({
            formStyle: value,
        });
    }
}
EditDataEntryForm.propTypes = {
    params: React.PropTypes.object.isRequired,
};
EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

export default EditDataEntryForm;
