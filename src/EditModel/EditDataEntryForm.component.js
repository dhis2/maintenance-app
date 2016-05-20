import React from 'react';
import Rx from 'rx';
import log from 'loglevel';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Paper from 'material-ui/lib/paper';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';


const inputPattern = /<input.*?\/>/gi;
const dataElementCategoryOptionIdPattern = /id="(\w*?)-(\w*?)-val"/;
const dataElementPattern = /dataelementid="(\w{11})"/;
const indicatorPattern = /indicatorid="(\w{11})"/;

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
    item: {
    },
    activeItem: {
        textDecoration: 'line-through',
    },
};

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        const CKEDITOR = window.CKEDITOR || {};
        this.state = {
            usedIds: [],
        };

        Promise.all([
            context.d2.models.dataSets.get(props.params.modelId, {
                fields: 'displayName,dataEntryForm[style,htmlCode],indicators[id,displayName]',
            }),
            // TODO: Use d2.models when dataElementOperands are properly supported
            context.d2.Api.getApi().get('dataElementOperands', {
                paging: false,
                totals: true,
                fields: 'id,displayName',
                filter: [`dataElement.dataSets.id:eq:${props.params.modelId}`],
            }),
        ]).then(([
            dataSet,
            ops,
        ]) => {
            // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
            // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
            // custom forms: "dataElementId-categoryOptionId-val"
            this.operands = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') !== -1)
                .reduce((out, op) => {
                    const id = `${op.id.split('.').join('-')}-val`;
                    out[id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            // Data element totals have only a single ID and thus no dot ('.')
            this.totals = ops.dataElementOperands
                .filter(op => op.id.indexOf('.') === -1)
                .reduce((out, op) => {
                    out[op.id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            this.indicators = dataSet.indicators.toArray()
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .reduce((out, i) => {
                    out[i.id] = i.displayName; // eslint-disable-line
                    return out;
                }, {});

            const formHtml = dataSet.dataEntryForm ? this.processFormData(dataSet.dataEntryForm) : '';

            this.setState({
                formTitle: dataSet.displayName,
                formHtml,
                formStyle: dataSet.dataEntryForm && dataSet.dataEntryForm.formStyle || 'NORMAL',
            }, () => {
                this._editor = CKEDITOR.replace('designTextarea', {
                    removePlugins: 'scayt,wsc,about',
                    allowedContent: true,
                    extraPlugins: 'div',
                    height: 500,
                });
                this._editor.setData(this.state.formHtml);
                Rx.Observable.fromEventPattern((x) => { this._editor.on('change', x); })
                    .debounce(150)
                    .subscribe(() => {
                        this.processFormData.call(this, this._editor.getData());
                    });
            });
        });

        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleStyleChange = this.handleStyleChange.bind(this);
    }

    componentWillUnmount() {
        if (this._editor) {
            this._editor.destroy();
        }
    }

    handleSaveClick() {
        console.warn(this._editor.getData());
    }

    handleCancelClick() {
        console.warn('Cancel!');
    }

    handleStyleChange(e, i, value) {
        this.setState({
            formStyle: value,
        });
    }

    renderPaletteSection(keySet) {
        // TODO: Styling
        return (
            Object.keys(keySet)
                // .filter(key => this.state.usedIds.indexOf(key) === -1)
                .map(key => {
                    const itemStyle = this.state.usedIds.indexOf(key) === -1 ? styles.item : styles.activeItem;
                    return (
                        <div key={key} style={itemStyle}>
                            <a title={`Click to insert input field for \"${keySet[key]}\"`}
                                onClick={this.insertElement.bind(this, key)}
                            >{keySet[key]}</a>
                        </div>
                    );
                })
        );
    }

    renderPalette() {
        // TODO: Floating dialog?
        return (
            <div style={styles.palette}>
                <div style={styles.paletteHeader}>Operands:</div>
                {this.renderPaletteSection(this.operands)}
                <div style={styles.paletteHeader}>Totals:</div>
                {this.renderPaletteSection(this.totals)}
                <div style={styles.paletteHeader}>Indicators:</div>
                {this.renderPaletteSection(this.indicators)}
            </div>
        );
    }

    render() {
        // TODO: Autosaving

        return this.state.formHtml === undefined ? <LoadingMask /> : (
            <div>
                <Heading style={styles.heading}>
                    {this.state.formTitle} {this.context.d2.i18n.getTranslation('data_entry_form')}
                </Heading>
                {this.renderPalette()}
                <textarea id="designTextarea" name="designTextarea"/>
                <Paper style={styles.formPaper}>
                    <div style={styles.formSection}>
                        <SelectField
                            value={this.state.formStyle}
                            floatingLabelText="Form display style"
                            onChange={this.handleStyleChange}
                        >
                            <MenuItem value={'NORMAL'} primaryText="Normal"/>
                            <MenuItem value={'COMFORTABLE'} primaryText="Comfortable"/>
                            <MenuItem value={'COMPACT'} primaryText="Compact"/>
                            <MenuItem value={'NONE'} primaryText="None"/>
                        </SelectField>
                    </div>
                    <div style={styles.formSection}>
                        <RaisedButton label="Save" primary onClick={this.handleSaveClick}/>
                        <FlatButton label="Cancel" style={styles.cancelButton} onClick={this.handleCancelClick}/>
                    </div>
                </Paper>
            </div>
        );
    }

    generateHtml(id, styleAttr, disabledAttr) {
        const style = styleAttr ? ` style=${styleAttr}` : '';
        const disabled = disabledAttr ? ' disabled="disabled"' : '';

        if (id.indexOf('-') !== -1) {
            const label = this.operands && this.operands[id];
            const attr = `name="entryfield" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input id="${id}" ${attr}/>`;
        } else if (this.totals.hasOwnProperty(id)) {
            const label = this.totals[id];
            const attr = `name="total" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input dataelementid="${id}" id="total${id}" name="total" ${attr}/>`;
        } else if (this.indicators.hasOwnProperty(id)) {
            const label = this.indicators[id];
            const attr = `name="indicator" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input indicatorid="${id}" id="indicator${id}" ${attr}/>`;
        }

        log.warn('Failed to generate HTML for ID:', id);
        return '';
    }

    processFormData(formData) {
        const inHtml = formData.htmlCode || formData || '';
        let outHtml = '';

        const usedIds = [];

        let inputElement = inputPattern.exec(inHtml);
        let inPos = 0;
        while (inputElement !== null) {
            outHtml += inHtml.substr(inPos, inputElement.index - inPos);
            inPos = inputPattern.lastIndex;

            const inputHtml = inputElement[0];
            const inputStyle = (/style="(.*?)"/.exec(inputHtml) || ['', ''])[1];
            const inputDisabled = /disabled/.exec(inputHtml) !== null;

            const idMatch = dataElementCategoryOptionIdPattern.exec(inputHtml);
            const dataElementTotalMatch = dataElementPattern.exec(inputHtml);
            const indicatorMatch = indicatorPattern.exec(inputHtml);

            if (idMatch) {
                const id = `${idMatch[1]}-${idMatch[2]}-val`;
                usedIds.push(id);
                outHtml += this.generateHtml(id, inputStyle, inputDisabled);
            } else if (dataElementTotalMatch) {
                const id = dataElementTotalMatch[1];
                usedIds.push(id);
                outHtml += this.generateHtml(id, inputStyle, inputDisabled);
            } else if (indicatorMatch) {
                const id = indicatorMatch[1];
                usedIds.push(id);
                outHtml += this.generateHtml(id, inputStyle, inputDisabled);
            } else {
                outHtml += inputHtml;
            }

            inputElement = inputPattern.exec(inHtml);
        }
        outHtml += inHtml.substr(inPos);

        this.setState({ usedIds });

        return outHtml;
    }

    insertElement(id) {
        // TODO: Don't insert elements that are already present
        this._editor.insertHtml(this.generateHtml(id), 'unfiltered_html');
        this.setState(state => ({ usedIds: state.usedIds.concat(id) }));
        // Move the current selection to just after the newly inserted element
        const range = this._editor.getSelection().getRanges()[0];
        range.moveToElementEditablePosition(range.endContainer, true);
    }
}
EditDataEntryForm.propTypes = {
    params: React.PropTypes.object.isRequired,
};
EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

export default EditDataEntryForm;
