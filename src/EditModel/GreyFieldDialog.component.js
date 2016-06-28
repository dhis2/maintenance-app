import React from 'react';
import log from 'loglevel';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Checkbox from 'material-ui/lib/checkbox';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import snackActions from '../Snackbar/snack.actions';


const styles = {
    dialogContent: {
        maxWidth: 'none',
    },
    dialogDiv: {
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    table: {
        borderSpacing: 0,
        borderCollapse: 'collapse',
        margin: '0 auto',
    },
    th: {
        whiteSpace: 'nowrap',
        textAlign: 'center',
        border: '1px solid #e0e0e0',
        padding: 6,
    },
    thDataElements: {
        whiteSpace: 'nowrap',
        border: '1px solid #e0e0e0',
        background: '#f0f0f0',
        textAlign: 'left',
        padding: 6,
    },
    td: {
        whiteSpace: 'nowrap',
        padding: 2,
        border: '1px solid #e0e0e0',
        minWidth: 105,
    },
    tdDataElement: {
        whiteSpace: 'nowrap',
        padding: 6,
        border: '1px solid #e0e0e0',
    },
};

class GreyFieldDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categories: [],
        };

        this.closeDialog = this.closeDialog.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    componentWillReceiveProps(props) {
        if (props.sectionModel) {
            const dataElements = props.sectionModel.dataElements.toArray();
            if (dataElements.length < 1) {
                log.info(`Section ${props.sectionModel.displayName} contains no data elements`);
                snackActions.show({ message: this.getTranslation('this_section_has_no_data_elements') });
                this.props.onRequestClose();
                return;
            }

            const catComboId = props.sectionModel.dataElements.toArray()[0].categoryCombo.id;
            this.context.d2.models.categoryCombos
                .get(catComboId, {
                    fields: [
                        'id,displayName',
                        'categories[id,displayName,categoryOptions[id,displayName]]',
                        'categoryOptionCombos[id,displayName',
                        'categoryOptions[id,displayName]]',
                    ].join(','),
                })
                .then(categoryCombo => {
                    const categoryArrayToMap = (categories) => {
                        let appendage = null;

                        const reduceAppendage = (prev, categoryOption) => {
                            const out = prev;
                            out[categoryOption.id] = appendage;
                            return out;
                        };

                        while (categories.length > 0) {
                            appendage = categories.pop().categoryOptions.toArray().reduce(reduceAppendage, {});
                        }
                        return appendage;
                    };

                    const assignCocs = (target, options, coc) => {
                        if (options.length > 0) {
                            return Object.keys(target).reduce((prev, key) => {
                                const out = prev;
                                const keyPos = options.indexOf(key);
                                if (keyPos !== -1) {
                                    options.splice(keyPos, 1);
                                    out[key] = assignCocs(target[key], options, coc);
                                    return out;
                                }
                                out[key] = target[key];
                                return out;
                            }, {});
                        }
                        return coc;
                    };

                    // Build a nested map of categories:
                    // { level1_1 : { level2_1: { level3_1: null, level3_2: null }, level2_2: {...}, ... }, ... }
                    //
                    // Then convert to JSON and back as a fast way to remove any references within the structure
                    let cocMap = JSON.parse(JSON.stringify(categoryArrayToMap(categoryCombo.categories.toArray())));

                    // Fill in the leaf nodes in the cocMap with the actual coc's
                    categoryCombo.categoryOptionCombos.toArray().forEach(coc => {
                        const optionPath = coc.categoryOptions.toArray().map(o => o.id);
                        cocMap = assignCocs(cocMap, optionPath, { id: coc.id, displayName: coc.displayName });
                    });

                    const greyedFields = props.sectionModel.greyedFields.reduce((prev, gf) => {
                        if (prev.hasOwnProperty(gf.dataElement.id)) {
                            prev[gf.dataElement.id].push(gf.categoryOptionCombo.id);
                            return prev;
                        }

                        const out = prev;
                        if (gf.hasOwnProperty('dataElement') && gf.hasOwnProperty('categoryOptionCombo')) {
                            out[gf.dataElement.id] = [gf.categoryOptionCombo.id];
                        } else {
                            log.warn([
                                `Warning: Invalid greyed field present on section ${props.sectionModel.displayName}`,
                                `  - Data element: ${gf.dataElement && gf.dataElement.id || '(missing)'}`,
                                `  - Category option combo: ${gf.categoryOptionCombo && gf.categoryOptionCombo.id || '(missing)'}`,
                                `See ${props.sectionModel.href}`,
                            ].join('\n'));
                        }
                        return out;
                    }, {});

                    this.setState({
                        categories: categoryCombo.categories.toArray(),
                        optionCount: categoryCombo.categories.toArray()
                            .map(category => category.categoryOptions.size),
                        cocMap,
                        greyedFields,
                    });
                });
        }
    }

    closeDialog() {
        this.setState({ categories: [] });
        this.props.onRequestClose();
    }

    handleSaveClick() {
        const greyedFields = [];
        Object.keys(this.state.greyedFields).forEach(dataElement => {
            this.state.greyedFields[dataElement].forEach(coc => {
                greyedFields.push({
                    dataElement: { id: dataElement },
                    categoryOptionCombo: { id: coc },
                });
            });
        });

        const section = Object.assign(this.props.sectionModel, { greyedFields });

        section
            .save()
            .then(res => {
                log.info('Section updated', res);
                snackActions.show({ message: this.getTranslation('section_saved') });
                this.props.onRequestSave(section);
            })
            .catch(err => {
                log.error('Failed to save section:', err);
                snackActions.show({ message: this.getTranslation('failed_to_save_section') });
            });
    }

    renderTableHeader() {
        let prevRowColCount = 1;

        return this.state.categories.map((cat, catNum) => {
            const colSpan = this.state.optionCount
                .slice(catNum + 1)
                .reduce((product, optionCount) => optionCount * product, 1);

            const row = (
                <tr key={catNum}>
                    <th style={styles.thDataElements}>
                        { catNum === this.state.categories.length - 1 ? this.getTranslation('data_element') : null }
                    </th>
                    {
                        // For each column in the previous row...
                        Array.apply(null, Array(prevRowColCount)).map((e, rep) => {
                            // ... render the columns for this row
                            return cat.categoryOptions.toArray().map((opt, optNum) => {
                                return (
                                    <th key={`${optNum}.${rep}`}
                                        colSpan={colSpan}
                                        style={styles.th}
                                    >{opt.displayName}</th>
                                );
                            });
                        })
                    }</tr>
            );
            prevRowColCount *= cat.categoryOptions.size;
            return row;
        });
    }

    renderCheckbox(dataElement, fieldArray, fieldNum) {
        const resolveCoc = (cocMap, fields) => {
            if (fields.length === 0) {
                return cocMap;
            }

            const field = fields.shift();
            return resolveCoc(cocMap[field], fields);
        };

        const coc = resolveCoc(this.state.cocMap, fieldArray);

        const isGreyed =
            this.state.greyedFields.hasOwnProperty(dataElement.id) &&
            this.state.greyedFields[dataElement.id].indexOf(coc.id) !== -1;

        const toggleBoggle = ((dataElementId, categoryOptionComboId, event, disable) => {
            this.setState(state => {
                const greyedCocs = (state.greyedFields[dataElementId] || []).slice();
                if (disable) {
                    greyedCocs.splice(greyedCocs.indexOf(categoryOptionComboId), 1);
                } else {
                    greyedCocs.push(categoryOptionComboId);
                }

                const greyedFields = Object.keys(state.greyedFields)
                    .reduce((prev, deId) => {
                        const out = prev;
                        out[deId] = deId === dataElementId ? greyedCocs : state.greyedFields[deId];
                        return out;
                    }, {});

                if (greyedCocs.length > 0 && !greyedFields.hasOwnProperty(dataElementId)) {
                    greyedFields[dataElementId] = greyedCocs;
                }

                return { greyedFields };
            });
        }).bind(this, dataElement.id, coc.id);

        return (
            <td key={fieldNum} style={styles.td}>
                <Checkbox
                    defaultChecked={!isGreyed}
                    label={isGreyed ? this.getTranslation('disabled') : this.getTranslation('enabled')}
                    labelPosition="right"
                    labelStyle={{ whiteSpace: 'nowrap' }}
                    onCheck={toggleBoggle}
                />
            </td>
        );
    }

    renderDataElements() {
        const getCocFields = () => {
            return this.state.categories.reduce((prev, cat) => {
                if (prev.length > 0) {
                    const out = [];
                    prev.forEach(p => {
                        cat.categoryOptions.toArray().forEach(opt => {
                            const pout = p.slice();
                            pout.push(opt.id);
                            out.push(pout);
                        });
                    });
                    return out;
                }

                cat.categoryOptions.toArray().forEach(opt => {
                    prev.push([opt.id]);
                });
                return prev;
            }, []);
        };

        return this.props.sectionModel.dataElements.toArray().map((de, deNum) => {
            const cocFields = getCocFields();
            return (
                <tr key={deNum} style={{ background: deNum % 2 === 0 ? 'none' : '#f0f0f0' }}>
                    <td style={styles.tdDataElement}>{de.displayName}</td>
                    {cocFields.map((fields, fieldNum) => this.renderCheckbox(de, fields, fieldNum))}
                </tr>
            );
        });
    }

    render() {
        const title = this.props.sectionModel.displayName;
        const {
            open,
            ...extraProps,
        } = this.props;

        return (
            <Dialog
                autoScrollBodyContent
                autoDetectWindowHeight
                title={`${this.getTranslation('manage_grey_fields')}: ${title}`}
                style={{ maxWidth: 'none' }}
                contentStyle={styles.dialogContent}
                open={open && this.props.sectionModel.dataElements.size > 0}
                {...extraProps}
                actions={[
                    <FlatButton
                        label={this.getTranslation('cancel')}
                        onTouchTap={this.closeDialog}
                        style={{ marginRight: 16 }}
                    />,
                    <RaisedButton
                        primary
                        label={this.getTranslation('save')}
                        onTouchTap={this.handleSaveClick}
                    />,
                ]}
                onRequestClose={this.closeDialog}
            >
                <div style={styles.dialogDiv}>
                    {this.state.categories.length ? (
                        <table style={styles.table}>
                            <tbody>
                            {this.renderTableHeader()}
                            {this.props.sectionModel.dataElements && this.renderDataElements()}
                            </tbody>
                        </table>
                    ) : <LoadingMask size={0.75}/>}
                </div>
            </Dialog>
        );
    }
}

GreyFieldDialog.contextTypes = { d2: React.PropTypes.any.isRequired };
GreyFieldDialog.propTypes = {
    open: React.PropTypes.bool.isRequired,
    sectionModel: React.PropTypes.any.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    onRequestSave: React.PropTypes.func.isRequired,
};

export default GreyFieldDialog;
