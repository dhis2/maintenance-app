import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs';
import log from 'loglevel';
import { getInstance as getD2 } from 'd2/lib/d2';

import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Paper from 'material-ui/Paper/Paper';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import Action from 'd2-ui/lib/action/Action';

import snackActions from '../Snackbar/snack.actions';
import modelToEditStore from './modelToEditStore';
import { goToRoute } from '../router-utils';
import { processFormData, generateHtmlForId } from './processFormData';


function clampPaletteWidth(width) {
    return Math.min(750, Math.max(width, 250));
}


// TODO?: Automatic labels <span label-id="{id}-{id}"></span> / <span label-id="{id}"></span>

const styles = {
    heading: {
        paddingBottom: 18,
    },
    formContainer: {},
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
    deleteButton: {
        marginLeft: '2rem',
    },
};

const EditDataEntryForm = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [usedIds, setUsedIds] = useState([])
    const [filter, setFilter] = useState('')
    const [paletteWidth, setPaletteWidth] = useState(clampPaletteWidth(window.innerWidth / 3))
    const [insertGrey, setInsertGrey] = useState(false)

    const getTranslation = label => getD2().i18n.getTranslation(label)

    useEffect(() => {
        // loadData().then(() => setLoading(false)).catch(error => setError(error))
    }, [])
}

class EditDataEntryFormX extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            usedIds: [],
            filter: '',
            paletteWidth: clampPaletteWidth(window.innerWidth / 3),
            // expand: 'data_elements',
            insertGrey: false,
        };

        // Load form data, operands, indicators and flags
        Promise.all([
            context.d2.models.dataSets.get(props.params.modelId, {
                fields: 'id,displayName,dataEntryForm[id,style,htmlCode],indicators[id,displayName]',
            }),
            // TODO: Use d2.models when dataElementOperands are properly supported
            context.d2.Api.getApi().get('dataElementOperands', {
                paging: false,
                totals: true,
                fields: 'id,dimensionItem,displayName',
                dataSet: props.params.modelId,
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
                .filter(op => op.dimensionItem.indexOf('.') !== -1)
                .reduce((out, op) => {
                    const id = `${op.dimensionItem.split('.').join('-')}-val`;
                    out[id] = op.displayName; // eslint-disable-line
                    return out;
                }, {});

            // Data element totals have only a single ID and thus no dot ('.')
            this.totals = ops.dataElementOperands
                .filter(op => op.dimensionItem.indexOf('.') === -1)
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
            Object.keys(this.operands).forEach((x) => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.totals).forEach((x) => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.indicators).forEach((x) => {
                this.insertFn[x] = this.insertElement.bind(this, x);
            });
            Object.keys(this.flags).forEach((flag) => {
                this.insertFn[flag] = this.insertFlag.bind(this, flag);
            });

            // Create element filtering action
            this.filterAction = Action.create('filter');
            this.filterAction
                .map(({ data, complete, error }) => ({ data: data[1], complete, error }))
                .debounceTime(75)
                .subscribe((args) => {
                    const filter = args.data
                        .split(' ')
                        .filter(x => x.length);
                    this.setState({ filter });
                });

            let formHtml = ''
            if (dataSet.dataEntryForm) {
                const { outHtml, usedIds } = processFormData({
                    formData: dataSet.dataEntryForm,
                    insertGrey: this.state.insertGrey,
                    operands: this.operands,
                    totals: this.totals,
                    indicators: this.indicators,
                })
                this.setState({ usedIds })
            }

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
                    .debounceTime(250)
                    .subscribe(() => {
                        const { usedIds } = processFormData({
                            formData: this._editor.getData(),
                            insertGrey: this.state.insertGrey,
                            operands: this.operands,
                            totals: this.totals,
                            indicators: this.indicators,
                        });
                        this.setState({ usedIds });
                    });
            });
        });

        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);
    }

    componentWillUnmount() {
        if (this._editor) {
            this._editor.destroy();
        }
    }

    doResize = e => {
        if (!e.buttons) {
            // If no buttons are pressed it probably simply means we missed a mouseUp event - so stop resizing
            this.endResize();
        }
        e.preventDefault();
        e.stopPropagation();
        const width = clampPaletteWidth(this._startWidth + (this._startPos - e.clientX));
        window.requestAnimationFrame(() => {
            this.setState({
                paletteWidth: width,
            });
        });
    };

    endResize = () => {
        window.removeEventListener('mousemove', this.doResize);
        window.removeEventListener('mouseup', this.endResize);
    };

    handleCancelClick = () => {
        goToRoute('list/dataSetSection/dataSet');
    };

    handleDeleteClick = () => {
        snackActions.show({
            message: this.getTranslation('dataentryform_confirm_delete'),
            action: 'confirm',
            onClick: () => {
                this.context.d2.Api.getApi()
                    .delete(['dataEntryForms', modelToEditStore.state.dataEntryForm.id].join('/'))
                    .then(() => {
                        snackActions.show({ message: this.getTranslation('form_deleted') });
                        goToRoute('list/dataSetSection/dataSet');
                    })
                    .catch((err) => {
                        log.error('Failed to delete form:', err);
                        snackActions.show({ message: this.getTranslation('failed_to_delete_form'), action: 'ok' });
                    });
            },
        });
    };

    handleSaveClick = () => {
        const payload = {
            style: this.state.formStyle,
            htmlCode: this._editor.getData(),
        };
        this.context.d2.Api.getApi().post(['dataSets', this.props.params.modelId, 'form'].join('/'), payload)
            .then(() => {
                log.info('Form saved successfully');
                snackActions.show({ message: this.getTranslation('form_saved') });
                goToRoute('list/dataSetSection/dataSet');
            })
            .catch((e) => {
                log.warn('Failed to save form:', e);
                snackActions.show({
                    message: `${this.getTranslation('failed_to_save_form')}${e.message ? `: ${e.message}` : ''}`,
                    action: this.getTranslation('ok'),
                });
            });
    };

    handleStyleChange = (e, i, value) => {
        this.setState({
            formStyle: value,
        });
    };

    insertElement(id) {
        if (this.state.usedIds.includes(id)) {
            return;
        }

        this._editor.insertHtml(
            generateHtmlForId(id, {
                insertGrey: this.state.insertGrey,
                operands: this.operands,
                totals: this.totals,
                indicators: this.indicators,
            }),
            'unfiltered_html'
        );
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

    startResize = e => {
        this._startPos = e.clientX;
        this._startWidth = this.state.paletteWidth;
        window.addEventListener('mousemove', this.doResize);
        window.addEventListener('mouseup', this.endResize);
    };

    render() {
        if (this.state.formHtml === undefined) {
            return <LoadingMask />
        }

        const handleToggleGrey = insertGrey => {
            this.setState({ insertGrey });
        };
        const formContainerStyles = {
            ...styles.formContainer,
            marginRight: this.state.paletteWidth,
        };

        return (
            <div style={formContainerStyles}>
                <Heading style={styles.heading}>
                    {this.state.formTitle} {this.getTranslation('data_entry_form')}
                </Heading>
                <Palette
                    getTranslation={this.getTranslation}
                    usedIds={this.state.usedIds}
                    insertFn={this.insertFn}
                    filter={this.state.filter}
                    onFilterChange={this.filterAction}
                    sections={[
                        { keySet: this.operands, label: 'data_elements' },
                        { keySet: this.totals, label: 'totals' },
                        { keySet: this.indicators, label: 'indicators' },
                        { keySet: this.flags, label: 'flags' },
                    ]}
                    paletteWidth={this.state.paletteWidth}
                    onStartResize={this.startResize}
                    insertGrey={this.state.insertGrey}
                    onToggleGrey={handleToggleGrey}
                />
                <textarea id="designTextarea" name="designTextarea" />
                <Paper style={styles.formPaper}>
                    <div style={styles.formSection}>
                        <SelectField
                            value={this.state.formStyle}
                            floatingLabelText="Form display style"
                            onChange={this.handleStyleChange}
                        >
                            <MenuItem value={'NORMAL'} primaryText={this.getTranslation('normal')} />
                            <MenuItem value={'COMFORTABLE'} primaryText={this.getTranslation('comfortable')} />
                            <MenuItem value={'COMPACT'} primaryText={this.getTranslation('compact')} />
                            <MenuItem value={'NONE'} primaryText={this.getTranslation('none')} />
                        </SelectField>
                    </div>
                    <div style={styles.formSection}>
                        <RaisedButton label={this.getTranslation('save')} primary onClick={this.handleSaveClick} />
                        <FlatButton
                            label={this.getTranslation('cancel')}
                            style={styles.cancelButton}
                            onClick={this.handleCancelClick}
                        />
                        {modelToEditStore.state.dataEntryForm && modelToEditStore.state.dataEntryForm.id ? (
                            <FlatButton
                                primary
                                label={this.getTranslation('delete')}
                                style={styles.deleteButton}
                                onClick={this.handleDeleteClick}
                            />
                        ) : undefined}
                    </div>
                </Paper>
            </div>
        );
    }
}
EditDataEntryForm.propTypes = {
    params: PropTypes.object,
};
EditDataEntryForm.contextTypes = {
    d2: PropTypes.any,
};

export default EditDataEntryForm;
