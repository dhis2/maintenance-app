import React from 'react';
import Rx from 'rx';
import log from 'loglevel';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import Action from 'd2-ui/lib/action/Action';

import snackActions from '../Snackbar/snack.actions';
import { goBack } from '../router';

import '../../scss/EditModel/EditDataEntryForm.scss';


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
    paletteHeader: {
        fontWeight: 700,
        display: 'block',
        fontSize: 16,
        marginLeft: -16,
        paddingTop: 8,
    },
    paletteFilter: {
        position: 'absolute',
        top: -16,
        width: '100%',
        padding: '8px 8px 16px',
    },
    paletteFilterField: {
        width: '100%',
    },
};

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            usedIds: [],
            filter: '',
        };

        // Load form data, operands, indicators and flags
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
            context.d2.Api.getApi().get('system/flags'),
        ]).then(([
            dataSet,
            ops,
            flags,
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

            this.flags = flags.reduce((out, flag) => {
                out[flag.path] = flag.name; // eslint-disable-line
                return out;
            }, {});

            // Create inserter functions for all insertable elements
            // This avoids having to bind the functions during rendering
            this.insertFn = {};
            Object.keys(this.operands).forEach(x => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.totals).forEach(x => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.indicators).forEach(x => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.flags).forEach(flag => {
                this.insertFn[flag] = this.insertFlag.bind(this, flag);
            });

            // Create element filtering action
            this.filterAction = Action.create('filter');
            this.filterAction
                .map(({ data, complete, error }) => ({ data: data.target.value, complete, error }))
                .debounce(75)
                .subscribe(args => {
                    this.setState({ expand: '', filter: args.data.split(' ').filter(x => x.length) });
                });

            const formHtml = dataSet.dataEntryForm ? this.processFormData(dataSet.dataEntryForm) : '';

            this.setState({
                formTitle: dataSet.displayName,
                formHtml,
                formStyle: dataSet.dataEntryForm && dataSet.dataEntryForm.style || 'NORMAL',
            }, () => {
                this._editor = window.CKEDITOR.replace('designTextarea', {
                    plugins: [
                        'a11yhelp', 'basicstyles', 'bidi', 'blockquote',
                        'clipboard', 'colorbutton', 'colordialog', 'contextmenu',
                        'dialogadvtab', 'div', 'elementspath', 'enterkey',
                        'entities', 'filebrowser', 'find', 'floatingspace',
                        'font', 'format', 'horizontalrule', 'htmlwriter',
                        'image', 'indentlist', 'indentblock', 'justify',
                        'link', 'list', 'liststyle', 'magicline',
                        'maximize', 'forms', 'pastefromword', 'pastetext',
                        'preview', 'removeformat', 'resize', 'selectall',
                        'showblocks', 'showborders', 'sourcearea', 'specialchar',
                        'stylescombo', 'tab', 'table', 'tabletools',
                        'toolbar', 'undo', 'wsc', 'wysiwygarea',
                    ].join(','),
                    removePlugins: 'scayt,wsc,about',
                    allowedContent: true,
                    extraPlugins: 'div',
                    height: 500,
                });
                this._editor.setData(this.state.formHtml);

                Rx.Observable.fromEventPattern((x) => {
                    this._editor.on('change', x);
                })
                    .debounce(250)
                    .subscribe(() => {
                        this.processFormData.call(this, this._editor.getData());
                    });
            });
        });

        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);
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
        const payload = {
            style: this.state.formStyle,
            htmlCode: this._editor.getData(),
        };
        this.context.d2.Api.getApi().post(['dataSets', this.props.params.modelId, 'form'].join('/'), payload)
            .then(() => {
                log.info('Form saved successfully');
                snackActions.show({ message: 'Form saved', action: 'ok' });
            })
            .catch(e => {
                log.warn('Failed to save form:', e);
                snackActions.show({ message: 'Failed to save form' });
            });
    }

    handleCancelClick() {
        goBack();
    }

    handleStyleChange(e, i, value) {
        this.setState({
            formStyle: value,
        });
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
        const inHtml = formData.hasOwnProperty('htmlCode') ? formData.htmlCode : formData || '';
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
        if (this.state.usedIds.indexOf(id) !== -1) {
            return;
        }

        this._editor.insertHtml(this.generateHtml(id), 'unfiltered_html');
        this.setState(state => ({ usedIds: state.usedIds.concat(id) }));
        // Move the current selection to just after the newly inserted element
        const range = this._editor.getSelection().getRanges()[0];
        range.moveToElementEditablePosition(range.endContainer, true);
    }

    insertFlag(img) {
        this._editor.insertHtml(`<img src="../dhis-web-commons/flags/${img}" />`, 'unfiltered_html');
        const range = this._editor.getSelection().getRanges()[0];
        range.moveToElementEditablePosition(range.endContainer, true);
    }

    renderPaletteSection(keySet, expand) {
        const filtered = Object.keys(keySet)
            .filter(key => (!this.state.filter.length || this.state.filter.reduce((p, ft) => (
                p && keySet[key].toLowerCase().indexOf(ft.toLowerCase()) !== -1
            ), true)));
        const filterCount = Object.keys(filtered).length;

        const displayLimit = this.state.expand === expand ? 0 : 5;
        const display = displayLimit ? filtered.slice(0, displayLimit) : filtered;

        return (
            <div>{
                display
                    .map(key => {
                        // Active items are items that are NOT already added to the form
                        const isActive = this.state.usedIds.indexOf(key) === -1;
                        const className = isActive ? 'item active' : 'item inactive';
                        const name = keySet[key].name || keySet[key];
                        return (
                            <div key={key} className={className}>
                                <a onClick={this.insertFn[key]}>{name}</a>
                            </div>
                        );
                    })
            } {
                displayLimit && filterCount - displayLimit > 0 ? (
                    <div className="expand">
                        <a onClick={() => { this.setState({ expand }); }}>
                            ... click to show {filterCount - displayLimit} more
                        </a>
                    </div>
                ) : undefined
            }
            </div>
        );
    }

    renderPalette() {
        return (
            <div className="palette">
                <div style={styles.paletteFilter}>
                    <TextField
                        floatingLabelText={this.getTranslation('filter_elements')}
                        style={styles.paletteFilterField}
                        onChange={this.filterAction}
                    />
                </div>
                <div className="elements">
                    <div style={styles.paletteHeader}>{this.getTranslation('data_elements')}:</div>
                    {this.renderPaletteSection(this.operands, 'data_elements')}
                    <div style={styles.paletteHeader}>{this.getTranslation('totals')}:</div>
                    {this.renderPaletteSection(this.totals, 'totals')}
                    <div style={styles.paletteHeader}>{this.getTranslation('indicators')}:</div>
                    {this.renderPaletteSection(this.indicators, 'indicators')}
                    <div style={styles.paletteHeader}>{this.getTranslation('flags')}:</div>
                    {this.renderPaletteSection(this.flags, 'flags')}
                </div>
            </div>
        );
    }

    render() {
        return this.state.formHtml === undefined ? <LoadingMask /> : (
            <div>
                <Heading style={styles.heading}>
                    {this.state.formTitle} {this.getTranslation('data_entry_form')}
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
                            <MenuItem value={'NORMAL'} primaryText={this.getTranslation('normal')}/>
                            <MenuItem value={'COMFORTABLE'} primaryText={this.getTranslation('comfortable')}/>
                            <MenuItem value={'COMPACT'} primaryText={this.getTranslation('compact')}/>
                            <MenuItem value={'NONE'} primaryText={this.getTranslation('none')}/>
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
}
EditDataEntryForm.propTypes = {
    params: React.PropTypes.object.isRequired,
};
EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

export default EditDataEntryForm;
