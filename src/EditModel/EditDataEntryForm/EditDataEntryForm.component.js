import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs';
import log from 'loglevel';
import { getInstance as getD2 } from 'd2/lib/d2';
import { NoticeBox } from '@dhis2/ui';

import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Paper from 'material-ui/Paper/Paper';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';

import snackActions from '../../Snackbar/snack.actions';
import modelToEditStore from '../modelToEditStore';
import { goToRoute } from '../../router-utils';

import Palette from './Palette.component';
import { processFormData, generateHtmlForId } from './processFormData';
import { useData } from './useData';
import { useResize } from './useResize';
import { clampPaletteWidth } from './clampPaletteWidth';

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

const createEditor = () => {
    return window.CKEDITOR.replace('designTextarea', {
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
    })
}

// TODO: replace with useD2 from app-runtime-adapter-d2 if
// https://github.com/dhis2/maintenance-app/pull/2182 is merged
const useD2 = () => {
    const [d2, setD2] = useState();
    useEffect(() => {
        getD2().then(d2 => setD2(d2));
    }, []);

    return { d2 };
}

// TODO?: Automatic labels <span label-id="{id}-{id}"></span> / <span label-id="{id}"></span>
const EditDataEntryForm = ({ params }) => {
    const { d2 } = useD2();
    const getTranslation = label => {
        if (d2) {
            return d2.i18n.getTranslation(label);
        }
        return label;
    }

    const insertElementRef = useRef()
    insertElementRef.current = id => {
        if (usedIds.includes(id)) {
            return;
        }

        // TODO
        this._editor.insertHtml(
            generateHtmlForId(id, {
                insertGrey,
                operands,
                totals,
                indicators,
            }),
            'unfiltered_html'
        );
        setUsedIds(usedIds => ({ usedIds: usedIds.concat(id) }));
        // TODO
        // Move the current selection to just after the newly inserted element
        const range = this._editor.getSelection().getRanges()[0];
        range.moveToElementEditablePosition(range.endContainer, true);
    }
    const insertFlagRef = useRef()
    insertFlagRef.current = img => {
        // TODO
        this._editor.insertHtml(`<img src="../dhis-web-commons/flags/${img}" />`, 'unfiltered_html');
        const range = this._editor.getSelection().getRanges()[0];
        range.moveToElementEditablePosition(range.endContainer, true);
    }

    const [usedIds, setUsedIds] = useState([]);
    const [paletteWidth, setPaletteWidth] = useState(
        clampPaletteWidth(window.innerWidth / 3)
    );
    const [insertGrey, setInsertGrey] = useState(false);
    const [insertFn, setInsertFn] = useState({});
    const [formTitle, setFormTitle] = useState('');
    const [formHtml, setFormHtml] = useState('');
    const [formStyle, setFormStyle] = useState('NORMAL');
    const { onStartResize } = useResize({ paletteWidth, setPaletteWidth });
    const {
        loading,
        error,
        operands,
        totals,
        indicators,
        flags
    } = useData({
        modelId: params.modelId,
        onComplete: ({
            dataSet,
            operands,
            totals,
            indicators,
            flags
        }) => {
            // Create inserter functions for all insertable elements
            // This avoids having to bind the functions during rendering
            const insertFn = {};
            const bindFnToElement = element => {
                insertFn[element] = () => { insertElementRef.current(element); };
            }
            Object.keys(operands).forEach(bindFnToElement);
            Object.keys(totals).forEach(bindFnToElement);
            Object.keys(indicators).forEach(bindFnToElement);
            Object.keys(flags).forEach(flag => {
                insertFn[flag] = () => { insertFlagRef.current(flag); };
            });
            setInsertFn(insertFn);

            let formHtml = '';
            if (dataSet.dataEntryForm) {
                const { outHtml, usedIds } = processFormData({
                    formData: dataSet.dataEntryForm,
                    insertGrey,
                    operands,
                    totals,
                    indicators,
                });
                setUsedIds(usedIds);
            }

            setFormTitle(dataSet.displayName);
            setFormHtml(formHtml);
            setFormStyle(dataSet.dataEntryForm && dataSet.dataEntryForm.style || 'NORMAL');

            // TODO
            /*const editor = createEditor()
              editor.setData(formHtml);

              Rx.Observable.fromEventPattern((x) => {
              editor.on('change', x);
              })
              .debounceTime(250)
              .subscribe(() => {
              // TODO: store form related state in one variable
              // and with use-debounce do:
              // setFormState(formState => ({ ...formState, formData: editor.getData() }))
              // or use useRef

              const { usedIds } = processFormData({
              formData: editor.getData(),
              insertGrey: this.state.insertGrey,
              operands: this.operands,
              totals: this.totals,
              indicators: this.indicators,
              });
              this.setState({ usedIds });
              });*/
        }
    })

    const handleSaveClick = async () => {
        const payload = {
            style: formStyle,
            // TODO
            // htmlCode: this._editor.getData(),
        };

        try {
            await getD2().Api.getApi().post(['dataSets', params.modelId, 'form'].join('/'), payload)

            log.info('Form saved successfully');
            snackActions.show({ message: getTranslation('form_saved') });
            goToRoute('list/dataSetSection/dataSet');
        } catch (e) {
            log.warn('Failed to save form:', e);
            // TODO: use i18n interpolation for message instead of manually constructing string
            snackActions.show({
                message: `${this.getTranslation('failed_to_save_form')}${e.message ? `: ${e.message}` : ''}`,
                action: getTranslation('ok'),
            });
        }
    };
    const handleCancelClick = () => {
        goToRoute('list/dataSetSection/dataSet');
    };
    const handleDeleteClick = () => {
        snackActions.show({
            message: getTranslation('dataentryform_confirm_delete'),
            action: 'confirm',
            onClick: async () => {
                try {
                    await getD2().Api.getApi().delete([
                        'dataEntryForms', modelToEditStore.state.dataEntryForm.id
                    ].join('/'));

                    snackActions.show({ message: getTranslation('form_deleted') });
                    goToRoute('list/dataSetSection/dataSet');
                } catch (err) {
                    log.error('Failed to delete form:', err);
                    snackActions.show({
                        message: getTranslation('failed_to_delete_form'),
                        action: 'ok'
                    });
                }
            },
        });
    };

    if (loading || !d2) {
        return <LoadingMask />
    }

    if (error) {
        return (
            <NoticeBox error>
                {error.toString()}
            </NoticeBox>
        )
    }

    const formContainerStyles = {
        ...styles.formContainer,
        marginRight: paletteWidth,
    };

    return (
        <div style={formContainerStyles}>
            <Heading style={styles.heading}>
                {formTitle} {getTranslation('data_entry_form')}
            </Heading>
            <Palette
                getTranslation={getTranslation}
                usedIds={usedIds}
                insertFn={insertFn}
                sections={[
                    { keySet: operands, label: 'data_elements' },
                    { keySet: totals, label: 'totals' },
                    { keySet: indicators, label: 'indicators' },
                    { keySet: flags, label: 'flags' },
                ]}
                paletteWidth={paletteWidth}
                onStartResize={onStartResize}
                insertGrey={insertGrey}
                onToggleGrey={setInsertGrey}
            />
            {/*<textarea id="designTextarea" name="designTextarea" />*/}
            <Paper style={styles.formPaper}>
                <div style={styles.formSection}>
                    {/* TODO: translate label 'Form display style' */}
                    <SelectField
                        value={formStyle}
                        floatingLabelText="Form display style"
                        onChange={(e, i, value) => setFormStyle(value)}
                    >
                        <MenuItem value="NORMAL" primaryText={getTranslation('normal')} />
                        <MenuItem value="COMFORTABLE" primaryText={getTranslation('comfortable')} />
                        <MenuItem value="COMPACT" primaryText={getTranslation('compact')} />
                        <MenuItem value="NONE" primaryText={getTranslation('none')} />
                    </SelectField>
                </div>
                <div style={styles.formSection}>
                    <RaisedButton label={getTranslation('save')} primary onClick={handleSaveClick} />
                    <FlatButton
                        label={getTranslation('cancel')}
                        style={styles.cancelButton}
                        onClick={handleCancelClick}
                    />
                    {modelToEditStore.state?.dataEntryForm?.id && (
                        <FlatButton
                            primary
                            label={getTranslation('delete')}
                            style={styles.deleteButton}
                            onClick={handleDeleteClick}
                        />
                    )}
                </div>
            </Paper>
        </div>
    );
}

EditDataEntryForm.propTypes = {
    params: PropTypes.shape({
        modelId: PropTypes.string.isRequired,
    }).isRequired,
};

export default EditDataEntryForm;
