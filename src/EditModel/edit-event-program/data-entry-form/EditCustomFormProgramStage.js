import React from 'react';
import { Observable } from 'rxjs';
import log from 'loglevel';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Paper from 'material-ui/Paper/Paper';
import TextField from 'material-ui/TextField/TextField';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Action from 'd2-ui/lib/action/Action';
import pure from 'recompose/pure';
import mapPropsStream from 'recompose/mapPropsStream';
import { get, compose, first, getOr, noop, isEqual, find, curry } from 'lodash/fp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dataEntryFormChanged, dataEntryFormRemove } from './actions';
import snackActions from '../../../Snackbar/snack.actions';
import eventProgramStore from '../eventProgramStore';
import CKEditor from './CKEditor';
import '../../../../scss/EditModel/EditDataEntryFormProgramStage.scss';

const firstProgramStage$ = eventProgramStore
    .map(compose(first, get('programStages')));

const availableTrackerDataElements$ = eventProgramStore
    .map(get('availableDataElements'))
    .take(1);

const dataEntryFormForFirstProgramStage$ = eventProgramStore
    .map((state) => {
        const firstProgramStage = first(get('programStages', state));

        return state.dataEntryFormForProgramStage[firstProgramStage.id];
    });

function addMissingDisplayNamesFrom(trackerDataElements, dataElement) {
    return getOr('Unknown', 'displayName', find(compose(isEqual(dataElement.id), get('id')), trackerDataElements));
}

const programStageDataElements$ = firstProgramStage$
    .combineLatest(availableTrackerDataElements$, (programStage, trackerDataElements) => ({ programStage, trackerDataElements }))
    .map(({ programStage, trackerDataElements }) => {
        const programStageDataElements = getOr([], 'programStageDataElements', programStage);

        return programStageDataElements
            .filter(get('dataElement'))
            .map(programStageDataElement => ({
                id: `${programStage.id}.${programStageDataElement.dataElement.id}`,
                displayName: programStageDataElement.dataElement.displayName || addMissingDisplayNamesFrom(trackerDataElements, programStageDataElement.dataElement),
            }));
    });

const inputPattern = /<input.*?\/>/gi;
const dataElementCategoryOptionIdPattern = /id="(\w*?)-(\w*?)-val"/;

const styles = {
    heading: {
        paddingBottom: 18,
    },
    formContainer: {},
    formPaper: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        margin: '0 auto 2rem',
        padding: '4rem 4rem',
        alignItems: 'center',
    },
    formSection: {
    },
    cancelButton: {
        marginLeft: '2rem',
    },
    deleteButton: {
        marginLeft: '2rem',
    },
    paletteHeader: {},
    paletteFilter: {
        padding: '0 8px 8px',
    },
    paletteFilterField: {
        width: '100%',
    },
    greySwitch: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
};

function PaletteSection({ keySet, label, filter, expand, expandClick, usedIds, insertFn }, { d2 }) {
    const filteredItems = Object.keys(keySet)
        .filter(key => !filter.length || filter.every(
            filter => keySet[key].toLowerCase().indexOf(filter.toLowerCase()) !== -1
        ));

    const cellClass = label === expand ? 'cell expanded' : 'cell';

    return (
        <div className={cellClass}>
            <div style={styles.paletteHeader} className="header" onClick={expandClick}>
                <div className="arrow">&#9656;</div>
                {d2.i18n.getTranslation(label)}:
                <div className="count">{filteredItems.length}</div>
            </div>
            <div className="items">
                {
                    filteredItems
                        .sort((a, b) => keySet[a] ? keySet[a].localeCompare(keySet[b]) : a.localeCompare(b))
                        .map((key) => {
                            // Active items are items that are not already added to the form
                            const isActive = usedIds.indexOf(key) === -1;
                            const className = isActive ? 'item active' : 'item inactive';
                            const name = keySet[key].name || keySet[key];

                            return (
                                <div key={key} className={className} title={name}>
                                    <a onClick={insertFn[key]}>{name}</a>
                                </div>
                            );
                        })
                }
            </div>
        </div>
    );
}

PaletteSection.contextTypes = {
    d2: React.PropTypes.object,
};

const PurePaletteSection = pure(PaletteSection);

class EditDataEntryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        const dataEntryForm = props.dataEntryForm;

        this.state = {
            usedIds: [],
            filter: '',
            expand: 'data_elements',
            insertFn: {},
        };

        this.disposables = new Set();

        // Load form data, operands and flags
        this.disposables.add(Observable.combineLatest(
            firstProgramStage$,
            programStageDataElements$,
            Observable.fromPromise(context.d2.Api.getApi().get('system/flags')),
            (programStage, ops, flags) => ([programStage, ops, flags])
        )
            .take(1)
            .subscribe(([programStage, programStageDataElements, flags]) => {
                // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
                // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
                // custom forms: "dataElementId-categoryOptionId-val"
                this.operands = programStageDataElements
                    .filter(op => op.id.indexOf('.') !== -1)
                    .reduce((out, op) => {
                        const id = `${op.id.split('.').join('-')}-val`;
                        out[id] = op.displayName; // eslint-disable-line
                        return out;
                    }, {});

                this.flags = flags.reduce((out, flag) => {
                    out[flag.path] = flag.name; // eslint-disable-line
                    return out;
                }, {});

                // Create inserter functions for all insertable elements
                // This avoids having to bind the functions during rendering
                const insertFn = {};
                Object.keys(this.operands).forEach((x) => {
                    insertFn[x] = this.insertElement.bind(this, x);
                });
                Object.keys(this.flags).forEach((flag) => {
                    insertFn[flag] = this.insertFlag.bind(this, flag);
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

                const formHtml = dataEntryForm ? this.processFormData(getOr('', 'htmlCode', dataEntryForm)) : '';

                this.setState({
                    insertFn,
                    formHtml,
                    dataEntryForm,
                    formTitle: programStage.displayName,
                });
            }));

        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleStyleChange = this.handleStyleChange.bind(this);
        this.setEditorReference = this.setEditorReference.bind(this);
    }

    componentWillUnmount() {
        this.disposables.forEach(disposable => disposable.unsubscribe());
    }

    componentWillReceiveProps({ dataEntryForm }) {
        if (this.state.dataEntryForm && dataEntryForm !== this.state.dataEntryForm) {
            const formHtml = dataEntryForm ? this.processFormData(getOr('', 'htmlCode', dataEntryForm)) : '';

            this._editor.setData(formHtml);
        }
    }

    handleDeleteClick() {
        this.props.onFormDelete();
    }

    handleStyleChange(e, i, value) {
        if (this.state.dataEntryForm.style !== value) {
            this.props.onStyleChange(value);
        }
    }

    generateHtml(id, styleAttr, disabledAttr) {
        const style = styleAttr ? ` style=${styleAttr}` : '';
        const disabled = disabledAttr ? ` disabled=${disabledAttr}` : '';

        if (id.indexOf('-') !== -1) {
            const label = this.operands && this.operands[id];
            const attr = `name="entryfield" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
            return `<input id="${id}" ${attr}/>`;
        }

        log.warn('Failed to generate HTML for ID:', id);
        return '';
    }

    processFormData(formData) {
        const inHtml = formData;
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

            if (idMatch) {
                const id = `${idMatch[1]}-${idMatch[2]}-val`;
                usedIds.push(id);
                outHtml += this.generateHtml(id, inputStyle, inputDisabled);
            } else {
                outHtml += inputHtml;
            }

            inputElement = inputPattern.exec(inHtml);
        }
        outHtml += inHtml.substr(inPos);

        this.setState({
            usedIds,
        }, () => {
            // If there is no dataEntryFormyet we'll just ignore.
            if (!this.state.dataEntryForm) {
                return;
            }

            // Emit a value when the html changed
            if (this.state.dataEntryForm.htmlCode !== outHtml) {
                this.props.onFormChange(outHtml);
            }
        });

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

    setEditorReference(editor) {
        this._editor = editor;
    }

    renderPalette() {
        return (
            <div className="paletteContainer" style={{ }}>
                <div className="palette">
                    <div style={styles.paletteFilter}>
                        <TextField
                            hintText={this.getTranslation('filter_elements')}
                            style={styles.paletteFilterField}
                            onChange={this.filterAction}
                            fullWidth
                        />
                    </div>
                    <div className="elements">
                        <PurePaletteSection
                            keySet={this.operands}
                            label="data_elements"
                            filter={this.state.filter}
                            expand={this.state.expand}
                            expandClick={() => { this.setState({ expand: 'data_elements' }); }}
                            usedIds={this.state.usedIds}
                            insertFn={this.state.insertFn}
                        />
                        <PurePaletteSection
                            keySet={this.flags}
                            label="flags"
                            filter={this.state.filter}
                            expand={this.state.expand}
                            expandClick={() => { this.setState({ expand: 'flags' }); }}
                            usedIds={this.state.usedIds}
                            insertFn={this.state.insertFn}
                        />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        const props = this.props;

        return this.state.formHtml === undefined ? <LoadingMask /> : (
            <div style={Object.assign({}, styles.formContainer, { })}>
                <div className="programStageEditForm">
                    <div className="left">
                        <CKEditor
                            onEditorChange={(editorData) => {
                                this.processFormData.call(this, editorData);
                            }}
                            onEditorInitialized={this.setEditorReference}
                            initialContent={this.state.formHtml}
                        />
                        <Paper style={styles.formPaper}>
                            <div style={styles.formSection}>
                                <SelectField
                                    value={getOr('NORMAL', 'style', props.dataEntryForm)}
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
                                {props.dataEntryForm && props.dataEntryForm.id ? (
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
                    <div className="right">
                        {this.renderPalette()}
                    </div>
                </div>
            </div>
        );
    }
}

EditDataEntryForm.propTypes = {
    params: React.PropTypes.object,
    onFormChange: React.PropTypes.func,
    onStyleChange: React.PropTypes.func,
    onFormDelete: React.PropTypes.func,
};

EditDataEntryForm.defaultProps = {
    onFormChange: noop,
    onStyleChange: noop,
    onFormDelete: noop,
};

EditDataEntryForm.contextTypes = {
    d2: React.PropTypes.any,
};

const mapDispatchToProps = (dispatch, { programStage }) => bindActionCreators({
    onFormChange: curry(dataEntryFormChanged)(programStage.id)('htmlCode'),
    onStyleChange: curry(dataEntryFormChanged)(programStage.id)('style'),
    onFormDelete: dataEntryFormRemove.bind(undefined, programStage.id),
}, dispatch);

const enhance = compose(
    mapPropsStream(props$ => props$
        .combineLatest(
            firstProgramStage$,
            dataEntryFormForFirstProgramStage$,
            (props, programStage, dataEntryForm) => ({
                ...props,
                programStage,
                dataEntryForm,
            })
        )
    ),
    connect(undefined, mapDispatchToProps)
);

export default enhance(EditDataEntryForm);
