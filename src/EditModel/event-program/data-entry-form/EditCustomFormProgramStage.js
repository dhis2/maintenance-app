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
import { getProgramStageDataElementsByStageId } from "../notifications/selectors";
import PaletteSection from './PaletteSection';
import { bindFuncsToKeys, moveEditorSelection, processFormData, insertElement as insElem, elementPatterns } from "./dataEntryFormUtils";

const programStageDataElementWithProgramStageId = programStageId => programStageDataElement => ({
    id: `${programStageId}.${programStageDataElement.id}`,
    displayName: programStageDataElement.displayName
})

const inputPattern = /<input.*?\/>/gi;
const dataElementCategoryOptionIdPattern = /id="(\w*?)-(\w*?)-val"/;

const PurePaletteSection = PaletteSection;

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
        const { programStage, dataElements } = props;
        // Load flags
        this.disposables.add(Observable.fromPromise(context.d2.Api.getApi().get('system/flags'))
            .subscribe(flags => {
                // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
                // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
                // custom forms: "dataElementId-categoryOptionId-val"
                this.operands = dataElements
                    .map(programStageDataElementWithProgramId(programStage.id))
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
        /*        const insertFn = {};
                Object.keys(this.operands).forEach((x) => {
                    insertFn[x] = this.insertElement.bind(this, x);
                });
                Object.keys(this.flags).forEach((flag) => {
                    insertFn[flag] = this.insertFlag.bind(this, flag);
                }); */
                const boundOps = bindFuncsToKeys(this.operands, this.insertElement, this);
                const boundFlags = bindFuncsToKeys(this.flags, this.insertElement, this);
                const insertFn = { ...boundOps, ...boundFlags}

                const { outHtml } = processFormData(getOr('', 'htmlCode', dataEntryForm), this.operands, elementPatterns.dataElementCategoryOptionIdPattern);
                const formHtml = dataEntryForm ? outHtml : '';

                this.setState({
                    insertFn,
                    formHtml,
                    dataEntryForm,
                    formTitle: this.props.formTitle,
                });
            }));
        // Create element filtering action
        this.filterAction = Action.create('filter');
        this.disposables.add(this.filterAction
            .map(({ data, complete, error }) => ({ data: data[1], complete, error }))
            .debounceTime(75)
            .subscribe((args) => {
                const filter = args.data
                    .split(' ')
                    .filter(x => x.length);
                this.setState({ filter });
            }));

        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleStyleChange = this.handleStyleChange.bind(this);
        this.setEditorReference = this.setEditorReference.bind(this);
    }

    componentWillUnmount() {
        this.disposables.forEach(disposable => disposable.unsubscribe());
    }
    //FIX loosing input-position on input
    componentWillReceiveProps({ dataEntryForm }) {
        if (this.state.dataEntryForm && dataEntryForm !== this.state.dataEntryForm) {
            const { outHtml } = processFormData(getOr('', 'htmlCode', dataEntryForm), this.operands, elementPatterns.dataElementCategoryOptionIdPattern);

            const formHtml = outHtml || '';

            //this._editor.setData(formHtml);
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

    handleEditorChanged = (editorData) => {
       // this.processFormData.call(this, editorData)
       // return;
        const { usedIds, outHtml} = processFormData(editorData, this.operands, elementPatterns.dataElementCategoryOptionIdPattern);
        this.setState({
            usedIds,
        }, () => {
            // Emit a value when the html changed
            if (!this.state.dataEntryForm ||this.state.dataEntryForm.htmlCode !== outHtml) {
                console.log("FORM CHANGE")
                this.props.onFormChange(outHtml);
            }
        });
    }

    insertElement(id) {
        if (this.state.usedIds.indexOf(id) !== -1) {
            return;
        }
        return insElem(id, this.operands[id], this._editor);

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
                            onEditorChange={this.handleEditorChanged}
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

const mapDispatchToPropsForProgramStage = (dispatch, { programStage }) => bindActionCreators({
    onFormChange: curry(dataEntryFormChanged)(programStage.id)('htmlCode'),
    onStyleChange: curry(dataEntryFormChanged)(programStage.id)('style'),
    onFormDelete: dataEntryFormRemove.bind(undefined, programStage.id),
}, dispatch);

const programStageDataEntryForm = compose(
    mapPropsStream(props$ => props$
        .combineLatest(
            eventProgramStore,
            ({programStage, ...props}, state) => ({
                ...props,
                programStage,
                dataEntryForm: state.dataEntryFormForProgramStage[programStage.id],
                dataElements: getProgramStageDataElementsByStageId(state)(programStage.id),
                formTitle: programStage.displayName
            })
        )
    ),
    connect(undefined, mapDispatchToPropsForProgramStage)
);

const mapDispatchToPropsForProgram = (dispatch, { program }) => bindActionCreators({
    onFormChange: curry(dataEntryFormChanged)(program.id)('htmlCode'),
    onStyleChange: curry(dataEntryFormChanged)(program.id)('style'),
    onFormDelete: dataEntryFormRemove.bind(undefined, program.id),
}, dispatch);

const programDataEntryForm = compose(
    mapPropsStream(props$ => props$
        .combineLatest(
            eventProgramStore,
            (props, {program}) => ({
                ...props,
                program,
                dataEntryForm: program.dataEntryForm,
                dataElements: program.programTrackedEntityAttributes, //getProgramStageDataElementsByStageId(state)(programStage.id),
                formTitle: program.displayName
            })
        )
    ),
    connect(undefined, mapDispatchToPropsForProgram)
);

export default programStageDataEntryForm(EditDataEntryForm);

export const CustomRegistrationDataEntryForm = programDataEntryForm(EditDataEntryForm);