import React from 'react';
import log from 'loglevel';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DropDown from '../forms/form-fields/drop-down';
import TextField from 'material-ui/lib/text-field';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditorWithOrdering.component';
import Store from 'd2-ui/lib/store/Store';
import snackActions from '../Snackbar/snack.actions';

import modelToEditStore from './modelToEditStore';
const dataElementStore = Store.create();
const assignedDataElementStore = Store.create();
const indicatorStore = Store.create();
const assignedIndicatorStore = Store.create();


class SectionDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categoryCombo: null,
        };
        dataElementStore.setState([]);
        assignedDataElementStore.setState([]);
        indicatorStore.setState([]);
        assignedIndicatorStore.setState([]);

        this.handleCategoryComboChange = this.handleCategoryComboChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.assignDataElements = this.assignDataElements.bind(this);
        this.removeDataElements = this.removeDataElements.bind(this);
        this.setAssignedDataElements = this.setAssignedDataElements.bind(this);
        this.assignIndicators = this.assignIndicators.bind(this);
        this.removeIndicators = this.removeIndicators.bind(this);
        this.setAssignedIndicators = this.setAssignedIndicators.bind(this);
        this.saveSection = this.saveSection.bind(this);

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    componentDidMount() {
        this.disposables = [];
        this.disposables.push(assignedDataElementStore.subscribe(() => {
            this.forceUpdate();
        }));
    }

    componentWillReceiveProps(props) {
        if (props.sectionModel) {
            const categoryComboId =
                props.sectionModel.dataElements &&
                props.sectionModel.dataElements.size &&
                props.sectionModel.dataElements.toArray().length > 0 &&
                props.sectionModel.dataElements.toArray()[0].categoryCombo.id ||
                props.categoryCombos[0].value;

            this.handleCategoryComboChange({ target: { value: categoryComboId } });

            assignedDataElementStore.setState(
                props.sectionModel.dataElements && props.sectionModel.dataElements.toArray().map(de => de.id) || []
            );

            indicatorStore.setState(
                modelToEditStore.state.indicators
                    .toArray()
                    .map(i => ({ value: i.id, text: i.displayName }))
                    .sort((a, b) => a.text.localeCompare(b.text))
            );
            assignedIndicatorStore.setState(
                props.sectionModel.indicators && props.sectionModel.indicators.toArray().map(i => i.id) || []
            );

            this.setState({
                name: props.sectionModel.name,
                description: props.sectionModel.description,
                filterText: '',
            }, () => {
                this.forceUpdate();
            });
        }
    }

    componentWillUnmount() {
        this.disposables.forEach(disposable => disposable.dispose());
    }

    handleCategoryComboChange(event) {
        const categoryComboId = event.target.value;

        dataElementStore.setState(
            modelToEditStore.state.dataElements
                .toArray()
                .filter(de => de.categoryCombo.id === categoryComboId)
                .map(de => ({ value: de.id, text: de.displayName }))
                .sort((a, b) => a.text.localeCompare(b.text))
        );
        assignedDataElementStore.setState([]);

        this.setState({
            categoryCombo: categoryComboId,
        });
    }

    handleFilterChange(e) {
        this.setState({ filterText: e.target.value });
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }

    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    assignDataElements(dataElements) {
        assignedDataElementStore.setState(assignedDataElementStore.state.concat(dataElements));
        return Promise.resolve();
    }

    removeDataElements(dataElements) {
        assignedDataElementStore.setState(assignedDataElementStore.state.filter(de => dataElements.indexOf(de) === -1));
        return Promise.resolve();
    }

    setAssignedDataElements(dataElements) {
        assignedDataElementStore.setState(dataElements);
    }

    assignIndicators(indicators) {
        assignedIndicatorStore.setState(assignedIndicatorStore.state.concat(indicators));
        return Promise.resolve();
    }

    removeIndicators(indicators) {
        assignedIndicatorStore.setState(assignedIndicatorStore.state.filter(i => indicators.indexOf(i) === -1));
        return Promise.resolve();
    }

    setAssignedIndicators(indicators) {
        assignedIndicatorStore.setState(indicators);
    }

    saveSection() {
        const sectionModel = this.props.sectionModel.id
            ? this.props.sectionModel
            : this.props.sectionModel.modelDefinition.create();
        Object.assign(sectionModel, {
            dataSet: { id: modelToEditStore.state.id },
            name: this.state.name,
            description: this.state.description,
            dataElements: assignedDataElementStore.state.map(de => ({ id: de })),
            indicators: assignedIndicatorStore.state.map(i => ({ id: i })),
            sortOrder: this.props.sectionModel.sortOrder || modelToEditStore
                .state
                .sections
                .toArray()
                .reduce((prev, s) => Math.max(prev, s.sortOrder + 1), 0),
        });
        sectionModel.save()
            .then((res) => {
                snackActions.show({ message: this.getTranslation('section_saved'), action: 'ok' });
                this.context.d2.models.sections.get(res.response.uid, {
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
                snackActions.show({ message: this.getTranslation('failed_to_save_section') });
            });
    }

    renderFilters() {
        const hasAssignment = assignedDataElementStore.state.length > 0;

        return (
            <div style={{ minWidth: 605 }}>
                <DropDown
                    options={this.props.categoryCombos}
                    labelText={this.getTranslation('category_combo')}
                    onChange={this.handleCategoryComboChange}
                    defaultValue={this.state.categoryCombo}
                    isRequired
                    disabled={hasAssignment}
                    style={{ width: 284 }}
                />
                <TextField
                    floatingLabelText={this.getTranslation('filter')}
                    onChange={this.handleFilterChange}
                    style={{ float: 'right', marginRight: 34, width: 284 }}
                />
            </div>
        );
    }

    renderAvailableOptions() {
        const labelStyle = {
            position: 'relative',
            display: 'block',
            width: '100%',
            lineHeight: '24px',
            color: 'rgba(0,0,0,0.3)',
            marginTop: '1.25rem',
            fontSize: 16,
        };

        return (
            <div>
                <div style={{ marginBottom: 80 }}>
                    <label style={labelStyle}>{this.getTranslation('data_elements')}</label>
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
                    <div style={{ marginBottom: 80 }}>
                        <label style={labelStyle}>{this.getTranslation('indicators')}</label>
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
    }

    render() {
        const title = this.props.sectionModel.id
            ? this.getTranslation('edit_section')
            : this.getTranslation('add_section');

        return (
            <Dialog
                autoScrollBodyContent
                title={title}
                actions={[
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
                    floatingLabelText={this.getTranslation('name')}
                    value={this.state.name}
                    style={{ width: '100%' }}
                    onChange={this.handleNameChange}
                />
                <TextField
                    floatingLabelText={this.getTranslation('description')}
                    value={this.state.description}
                    style={{ width: '100%' }}
                    multiLine
                    onChange={this.handleDescriptionChange}
                />
                {this.renderFilters()}
                {this.renderAvailableOptions()}
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
