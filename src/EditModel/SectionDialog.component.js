import React from 'react';
import log from 'loglevel';

import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import TextField from 'material-ui/TextField/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditorWithOrdering.component';

import Store from 'd2-ui/lib/store/Store';
import Checkbox from 'material-ui/Checkbox';

import DropDown from '../forms/form-fields/drop-down';
import snackActions from '../Snackbar/snack.actions';

import modelToEditStore from './modelToEditStore';
import SelectField from 'material-ui/SelectField';
import { MenuItem } from 'material-ui/DropDownMenu';

const dataElementStore = Store.create();
const assignedDataElementStore = Store.create();
const indicatorStore = Store.create();
const assignedIndicatorStore = Store.create();

class SectionDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categoryCombo: false,
            disableDataElementAutoGroup: false,
            displayOptions: {
                pivotMode: null,
                pivotedCategory: null,
            },
            categories: [],
        };
        dataElementStore.setState([]);
        assignedDataElementStore.setState([]);
        indicatorStore.setState([]);
        assignedIndicatorStore.setState([]);

        this.getTranslation = context.d2.i18n.getTranslation.bind(
            context.d2.i18n
        );
    }

    componentDidMount() {
        this.subscriptions = [];
        this.subscriptions.push(
            assignedDataElementStore.subscribe(() => {
                this.forceUpdate();
            })
        );

        const d2 = this.context.d2;
        const categoryCombos = this.props.categoryCombos
            .map(coc => coc.value)
            .join(',');

        return d2.models.categories
            .list({
                filter: `categoryCombos.id:in:[${categoryCombos}]`,
                paging: false,
                fields: [
                    'id,displayName',
                    'categoryCombos[id]',
                ].join(','),
            })
            .then(response => {
                const categories = response.toArray();

                this.setState({
                    categories,
                });
            }).catch(err => {
                snackActions.show({ message: 'Something went wrong.' + err, action: 'ok' });
            })
    }

    componentWillReceiveProps(props) {
        if (props.sectionModel) {
            const currentSectionId = props.sectionModel.id;
            const sections = modelToEditStore.state.sections;
            const sectionArray = Array.isArray(sections)
                ? sections
                : sections.toArray();
            const otherSections = sectionArray.filter(
                s => s.id !== currentSectionId
            );
            const filterDataElementIds = otherSections.reduce(
                (elements, section) =>
                    elements.concat(
                        (Array.isArray(section.dataElements)
                            ? section.dataElements
                            : section.dataElements.toArray()
                        ).map(de => de.id)
                    ),
                []
            );

            // Default category combo filter = no filter
            const categoryComboId = false;

            assignedDataElementStore.setState(
                props.sectionModel.dataElements
                    ? props.sectionModel.dataElements.toArray().map(de => de.id)
                    : []
            );

            indicatorStore.setState(
                modelToEditStore.state.indicators
                    .toArray()
                    .map(i => ({ value: i.id, text: i.displayName }))
                    .sort((a, b) => a.text.localeCompare(b.text))
            );
            assignedIndicatorStore.setState(
                props.sectionModel.indicators
                    ? props.sectionModel.indicators.toArray().map(i => i.id)
                    : []
            );

            this.setState(
                {
                    name: props.sectionModel.name,
                    code: props.sectionModel.code,
                    nameError: '',
                    codeError: '',
                    description: props.sectionModel.description,
                    showRowTotals: props.sectionModel.showRowTotals,
                    showColumnTotals: props.sectionModel.showColumnTotals,
                    displayOptions: props.sectionModel.displayOptions
                        ? JSON.parse(props.sectionModel.displayOptions)
                        : {},
                    disableDataElementAutoGroup:
                        props.sectionModel.disableDataElementAutoGroup,
                    filterText: '',
                    filterDataElementIds,
                },
                () => {
                    this.handleCategoryComboChange({
                        target: { value: categoryComboId },
                    });
                    this.forceUpdate();
                }
            );
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach(disposable => disposable.unsubscribe());
    }

    setAssignedDataElements = dataElements => {
        assignedDataElementStore.setState(dataElements);
    };

    setAssignedIndicators = indicators => {
        assignedIndicatorStore.setState(indicators);
    };

    removeIndicators = indicators => {
        assignedIndicatorStore.setState(
            assignedIndicatorStore.state.filter(
                i => indicators.indexOf(i) === -1
            )
        );
        return Promise.resolve();
    };

    assignIndicators = indicators => {
        assignedIndicatorStore.setState(
            assignedIndicatorStore.state.concat(indicators)
        );
        return Promise.resolve();
    };

    handleRowTotalsChange = (e, value) => {
        this.setState({ showRowTotals: value });
    };

    handleColumnTotalsChange = (e, value) => {
        this.setState({ showColumnTotals: value });
    };

    handleDisableDataElementAutoGroupChange = (e, value) => {
        this.setState({ disableDataElementAutoGroup: value });
    };

    handleFilterChange = e => {
        this.setState({ filterText: e.target.value });
    };

    handleNameChange = e => {
        const sectionArray = Array.isArray(modelToEditStore.getState().sections)
            ? modelToEditStore.getState().sections
            : modelToEditStore.getState().sections.toArray();
        const nameDupe = sectionArray
            .filter(s => s.id !== this.props.sectionModel.id)
            .reduce((res, s) => res || s.name === e.target.value, false);

        this.setState({
            name: e.target.value,
            nameError: nameDupe ? this.getTranslation('value_not_unique') : '',
        });
    };

    handleCodeChange = e => {
        const sectionArray = Array.isArray(modelToEditStore.getState().sections)
            ? modelToEditStore.getState().sections
            : modelToEditStore.getState().sections.toArray();
        const codeDupe = sectionArray
            .filter(s => s.id !== this.props.sectionModel.id)
            .reduce(
                (res, s) => res || (s.code && s.code === e.target.value),
                false
            );

        this.setState({
            code: e.target.value,
            codeError: codeDupe ? this.getTranslation('value_not_unique') : '',
        });
    };

    handleDescriptionChange = e => {
        this.setState({ description: e.target.value });
    };

    assignDataElements = dataElements => {
        assignedDataElementStore.setState(
            assignedDataElementStore.state.concat(dataElements)
        );
        return Promise.resolve();
    };

    removeDataElements = dataElements => {
        assignedDataElementStore.setState(
            assignedDataElementStore.state.filter(
                de => dataElements.indexOf(de) === -1
            )
        );
        return Promise.resolve();
    };

    handleCategoryComboChange = event => {
        const categoryComboId = event.target.value;

        if (modelToEditStore.state.dataSetElements) {
            dataElementStore.setState(
                modelToEditStore.state.dataSetElements
                    .filter(dse => {
                        if (categoryComboId) {
                            return dse.categoryCombo
                                ? dse.categoryCombo.id === categoryComboId
                                : dse.dataElement.categoryCombo.id ===
                                      categoryComboId;
                        }
                        return true;
                    })
                    .filter(
                        dse =>
                            this.state.filterDataElementIds
                                ? !this.state.filterDataElementIds.includes(
                                      dse.dataElement.id
                                  )
                                : true
                    )
                    .map(dse => ({
                        value: dse.dataElement.id,
                        text: dse.dataElement.displayName,
                    }))
                    .sort((a, b) => a.text.localeCompare(b.text))
            );
        }

        this.setState({
            categoryCombo: categoryComboId,
        });
    };

    saveSection = () => {
        if (!this.state.name || this.state.name.trim().length === 0) {
            snackActions.show({
                message: this.getTranslation('name_is_required'),
                action: this.getTranslation('ok'),
            });
            return;
        }

        const sectionModel = this.props.sectionModel.id
            ? this.props.sectionModel
            : this.props.sectionModel.modelDefinition.create();
        Object.assign(sectionModel, {
            dataSet: { id: modelToEditStore.state.id },
            name: this.state.name,
            code: this.state.code,
            description: this.state.description,
            showRowTotals: this.state.showRowTotals,
            showColumnTotals: this.state.showColumnTotals,
            displayOptions: JSON.stringify(this.state.displayOptions),
            disableDataElementAutoGroup: this.state.disableDataElementAutoGroup,
            dataElements: assignedDataElementStore.state.map(de => ({
                id: de,
            })),
            indicators: assignedIndicatorStore.state.map(i => ({ id: i })),
            sortOrder:
                this.props.sectionModel.sortOrder ||
                modelToEditStore.state.sections
                    .toArray()
                    .reduce((prev, s) => Math.max(prev, s.sortOrder + 1), 0),
        });
        sectionModel
            .save()
            .then(res => {
                snackActions.show({
                    message: this.getTranslation('section_saved'),
                });
                this.context.d2.models.sections
                    .get(res.response.uid, {
                        fields: [
                            ':all,dataElements[id,categoryCombo[id,displayName]]',
                            'greyedFields[categoryOptionCombo,dataElement]',
                        ].join(','),
                    })
                    .then(section => {
                        this.props.onSaveSection(section);
                    });
            })
            .catch(err => {
                log.warn('Failed to save section:', err);
                snackActions.show({
                    message: this.getTranslation('failed_to_save_section'),
                    action: this.getTranslation('ok'),
                });
            });
    };

    handleChoosePivotMode = (e, pivotMode) => {
        const [firstCategory] = this.state.categories || [];
        const categoryId = firstCategory ? firstCategory.id : null;
        const pivotedCategory =
            pivotMode === 'move_categories' ? categoryId : null;
        this.setState({
            displayOptions: {
                ...this.state.displayOptions,
                pivotMode,
                pivotedCategory,
            },
        });
    };

    handlePivotCategoryChoice = (event, i, pivotedCategoryValue) => {
        this.setState({
            displayOptions: {
                ...this.state.displayOptions,
                pivotedCategory: pivotedCategoryValue,
            },
        });
    };

    renderSectionDisplayConfigurationOptions = () => {
        const pivotOptions = [
            {
                value: 'n/a',
                text: this.getTranslation('pivot_default'),
            },
            {
                value: 'pivot',
                text: this.getTranslation('pivot_move_data_elements_to_column'),
            },
            {
                value: 'move_categories',
                text: this.getTranslation('pivot_move_category_to_row'),
            },
        ];
        const isMoveCategoryMode =
            this.state.displayOptions.pivotMode === 'move_categories';

        return (
            <div>
                <label>{this.getTranslation('pivot_options')}</label>
                <RadioButtonGroup
                    onChange={this.handleChoosePivotMode}
                    valueSelected={this.state.displayOptions.pivotMode}
                    name="pivotOptions"
                    defaultSelected="n/a"
                >
                    {pivotOptions.map(({ value, text }) => {
                        return (
                            <RadioButton
                                value={value}
                                label={text}
                                style={{ margin: '10px' }}
                            />
                        );
                    })}
                </RadioButtonGroup>
                {isMoveCategoryMode && (
                    <SelectField
                        style={{ marginLeft: '50px', marginTop: '-16px' }}
                        floatingLabelFixed
                        floatingLabelText={this.getTranslation(
                            'pivot_category_to_move_to_row'
                        )}
                        value={this.state.displayOptions.pivotedCategory}
                        onChange={this.handlePivotCategoryChoice}
                    >
                        {this.state.categories.map(cat => {
                            return (
                                <MenuItem
                                    value={cat.id}
                                    primaryText={cat.displayName}
                                />
                            );
                        })}
                    </SelectField>
                )}
            </div>
        );
    };

    renderFilters = () => {
        const catCombos = [
            { value: false, text: this.getTranslation('no_filter') },
        ].concat(
            this.props.categoryCombos.sort((a, b) =>
                a.text.localeCompare(b.text)
            )
        );

        return (
            <div style={{ minWidth: 605 }}>
                <DropDown
                    options={catCombos}
                    labelText={this.getTranslation('category_combo_filter')}
                    onChange={this.handleCategoryComboChange}
                    value={this.state.categoryCombo}
                    isRequired
                    disabled={this.props.categoryCombos.length === 1}
                    style={{ width: 284 }}
                />
                <TextField
                    fullWidth
                    hintText={this.getTranslation(
                        'search_available_selected_items'
                    )}
                    defaultValue={this.state.filterText}
                    onChange={this.handleFilterChange}
                />
            </div>
        );
    };

    renderAvailableOptions = () => {
        const labelStyle = {
            position: 'relative',
            display: 'block',
            width: '100%',
            lineHeight: '24px',
            color: 'rgba(0,0,0,0.3)',
            marginTop: '1.25rem',
            fontSize: 16,
        };

        const editorStyle = {
            marginBottom: 80,
        };

        return (
            <div>
                <div style={editorStyle}>
                    <label style={labelStyle}>
                        {this.getTranslation('data_elements')}
                    </label>
                    <GroupEditor
                        itemStore={dataElementStore}
                        assignedItemStore={assignedDataElementStore}
                        onAssignItems={this.assignDataElements}
                        onRemoveItems={this.removeDataElements}
                        onOrderChanged={this.setAssignedDataElements}
                        height={250}
                        filterText={this.state.filterText}
                    />
                </div>
                {indicatorStore.state.length ? (
                    <div style={editorStyle}>
                        <label style={labelStyle}>
                            {this.getTranslation('indicators')}
                        </label>
                        <GroupEditor
                            itemStore={indicatorStore}
                            assignedItemStore={assignedIndicatorStore}
                            onAssignItems={this.assignIndicators}
                            onRemoveItems={this.removeIndicators}
                            onOrderChanged={this.setAssignedIndicators}
                            height={250}
                            filterText={this.state.filterText}
                        />
                    </div>
                ) : null}
            </div>
        );
    };

    render() {
        let title = this.getTranslation('add_section');
        let sectionIdDiv = null;

        if (this.props.sectionModel.id) {
            title = this.getTranslation('edit_section');
            sectionIdDiv = (
                <div
                    style={{
                        float: 'left',
                        padding: 8,
                        color: 'rgba(0,0,0,0.5)',
                    }}
                >
                    {this.getTranslation('section_id')}:
                    <span style={{ fontFamily: 'monospace' }}>
                        {this.props.sectionModel.id}
                    </span>
                </div>
            );
        }

        const validateName = e => {
            this.setState({
                nameError:
                    e.target.value.trim().length > 0
                        ? ''
                        : this.getTranslation('value_required'),
            });
        };

        return (
            <Dialog
                autoScrollBodyContent
                title={title}
                actions={[
                    sectionIdDiv,
                    <FlatButton
                        label={this.getTranslation('cancel')}
                        onTouchTap={this.props.onRequestClose}
                        style={{ marginRight: 24 }}
                    />,
                    <RaisedButton
                        primary
                        label={this.getTranslation('save')}
                        onTouchTap={this.saveSection}
                    />,
                ]}
                {...this.props}
            >
                <TextField
                    floatingLabelText={`${this.getTranslation('name')} *`}
                    value={this.state.name || ''}
                    style={{ width: '100%' }}
                    onChange={this.handleNameChange}
                    errorText={this.state.nameError}
                    onBlur={validateName}
                />
                <TextField
                    floatingLabelText={this.getTranslation('code')}
                    value={this.state.code || ''}
                    style={{ width: '100%' }}
                    onChange={this.handleCodeChange}
                    errorText={this.state.codeError}
                />
                <TextField
                    floatingLabelText={this.getTranslation('description')}
                    value={this.state.description || ''}
                    style={{ width: '100%' }}
                    multiLine
                    onChange={this.handleDescriptionChange}
                />
                <Checkbox
                    label={this.getTranslation('show_row_totals')}
                    checked={this.state.showRowTotals}
                    style={{ margin: '16px 0' }}
                    onCheck={this.handleRowTotalsChange}
                />
                <Checkbox
                    label={this.getTranslation('show_column_totals')}
                    checked={this.state.showColumnTotals}
                    style={{ margin: '16px 0' }}
                    onCheck={this.handleColumnTotalsChange}
                />
                <Checkbox
                    label={this.getTranslation(
                        'disable_data_element_auto_group'
                    )}
                    checked={this.state.disableDataElementAutoGroup}
                    style={{ margin: '16px 0' }}
                    onCheck={this.handleDisableDataElementAutoGroupChange}
                />
                {this.renderFilters()}
                {this.renderAvailableOptions()}
                {this.renderSectionDisplayConfigurationOptions()}
            </Dialog>
        );
    }
}

SectionDialog.propTypes = {
    open: React.PropTypes.bool.isRequired,
    sectionModel: React.PropTypes.any.isRequired,
    categoryCombos: React.PropTypes.array.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    onSaveSection: React.PropTypes.func.isRequired,
};
SectionDialog.contextTypes = {
    d2: React.PropTypes.any.isRequired,
};

export default SectionDialog;
