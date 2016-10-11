import React, { Component, PropTypes } from 'react';
import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rx';
import componentFromStream from 'recompose/componentFromStream';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';
import Row from 'd2-ui/lib/layout/Row.component';
import DataSetElementCategoryComboSelectionDialog from './DataSetElementCategoryComboSelectionDialog.component';
import { uniq, includes, curry, get, isUndefined } from 'lodash';
import TextField from 'material-ui/TextField/TextField';

function getCategoryComboNameForDataElement(dses, de) {
    const dataSetElementForDataElement = Array
        .from(dses.values())
        .find(dse => dse.dataElement && dse.dataElement.id === de.id);

    if (dataSetElementForDataElement && dataSetElementForDataElement.categoryCombo) {
        return dataSetElementForDataElement.categoryCombo.displayName;
    }
}

function getDataElementNameForGroupEditor(dataSetElements, dataElement) {
    const categoryComboName = getCategoryComboNameForDataElement(dataSetElements, dataElement);

    if (categoryComboName) {
        return `${dataElement.displayName} (${categoryComboName})`;
    }

    return dataElement.displayName;
}

const styles = {
    fieldWrap: {
        marginBottom: '5rem',
    },

    label: {
        position: 'relative',
        display: 'block',
        width: 'calc(100% - 60px)',
        lineHeight: '24px',
        color: 'rgba(0,0,0,0.3)',
        marginTop: '1rem',
        fontSize: 16,
    },
};

class DataSetElementField extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            itemStore: Store.create(),
            assignedItemStore: Store.create(),
            filterText: '',
        };

        // TODO: Should update this with the assigned category combo name
        this.state.itemStore.setState(
            props.dataElements
                .map(dataElement => ({
                    text: getDataElementNameForGroupEditor(props.dataSet.dataSetElements, dataElement),
                    value: dataElement.id
                }))
        );
        this.state.assignedItemStore.setState(
            Array.from(props.dataSet.dataSetElements.values())
                .filter(dse => dse.dataElement)
                .sort((left, right) => ((left.dataElement && left.dataElement.displayName || '').localeCompare(right.dataElement && right.dataElement.displayName)))
                .map(dse => dse.dataElement.id)
        );
    }

    componentWillReceiveProps(props) {
        this.state.itemStore.setState(
            props.dataElements
                .map(dataElement => ({
                    text: getDataElementNameForGroupEditor(props.dataSet.dataSetElements, dataElement),
                    value: dataElement.id
                }))
        );

        this.state.assignedItemStore.setState(
            Array.from(props.dataSet.dataSetElements.values())
                .filter(dse => dse.dataElement)
                .sort((left, right) => ((left.dataElement && left.dataElement.displayName || '').localeCompare(right.dataElement && right.dataElement.displayName)))
                .map(dse => dse.dataElement.id)
        );
    }

    _assignItems = (items) => {
        const updateGroupEditorState = () => {
            const uniqueItems = new Set(this.state.assignedItemStore.getState().concat(items));

            this.state.assignedItemStore.setState(Array.from(uniqueItems));

            this.updateForm(Array.from(uniqueItems));
        };

        const d2 = this.context.d2;
        const api = d2.Api.getApi();

        return api.get('system/uid', { limit: items.length })
            .then(({ codes }) => {
                items
                    .map(dataElementId => this.props.dataElements.find(dataElement => dataElement.id === dataElementId))
                    .filter(de => de)
                    .forEach((dataElement, index) => {
                        const dataSetElement = d2.models.dataSetElement.create({
                            id: codes[index],
                            dataElement,
                            dataSet: {
                                id: this.props.dataSet.id,
                            },
                        });

                        this.props.dataSet.dataSetElements.add(dataSetElement);
                    });
            })
            .then(updateGroupEditorState)
            .catch(error => console.log(error));
    }

    _removeItems = (items) => {
        const updateGroupEditorStore = () => {
            const uniqueItems = new Set(this.state.assignedItemStore.getState());

            items.forEach(item => uniqueItems.delete(item));

            this.state.assignedItemStore.setState(Array.from(uniqueItems));

            this.updateForm(Array.from(uniqueItems));
        }

        return Promise.resolve(true)
            .then(() => {
                const dataSetElementsWithDataElement = (dataElementIds) => ({ dataElement = {} }) => !isUndefined(dataElement.id) && includes(dataElement.id, dataElementIds);
                const removeObjectFromMap = curry((collection, object) => collection.delete(get('id', object)));

                // Remove the items from the modelCollection
                Array.from(this.props.dataSet.dataSetElements.values())
                    .filter(dataSetElementsWithDataElement(items))
                    .forEach(removeObjectFromMap(this.props.dataSet.dataSetElements));
            })
            .then(updateGroupEditorStore)
            .catch(e => console.log(e));
    }

    _updateCategoryComboForDataSetElement = (dataSetElementId, categoryCombo) => {
        const dataSetElements = this.props.dataSet.dataSetElements;

        if (dataSetElements.has(dataSetElementId)) {
            const dataSetElement = dataSetElements.get(dataSetElementId);
            dataSetElement.categoryCombo = categoryCombo;

            this.props.onChange({
                target: {
                    value: dataSetElements,
                },
            });
        }

    }

    updateForm = (newAssignedItems) => {
        this.state.assignedItemStore.setState(uniq([].concat(newAssignedItems)));

        this.props.onChange({
            target: {
                value: this.props.dataSet.dataSetElements,
            },
        });
    }

    setFilterText = (event, value) => {
        this.setState({
            filterText: value,
        });
    }

    render() {
        const  {
            categoryCombos,
            dataSet,
        } = this.props;

        return (
            <div style={styles.fieldWrap}>
                <label style={styles.label}>{this.props.labelText}</label>
                <Row flexValue="0 0 auto" style={{ justifyContent: 'space-between' }}>
                    <TextField
                        value={this.state.filterText}
                        onChange={this.setFilterText}
                        fullWidth
                        hintText={this.context.d2.i18n.getTranslation('search_available_selected_items')}
                    />
                    <DataSetElementCategoryComboSelectionDialog
                        dataSetElements={dataSet.dataSetElements}
                        categoryCombos={categoryCombos}
                        onCategoryComboSelected={this._updateCategoryComboForDataSetElement}
                    />
                </Row>
                <GroupEditor
                    itemStore={this.state.itemStore}
                    assignedItemStore={this.state.assignedItemStore}
                    onAssignItems={this._assignItems}
                    onRemoveItems={this._removeItems}
                    height={250}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
}
DataSetElementField.contextTypes = {
    d2: PropTypes.object,
};

// metadata.json?dataElements:fields=id,displayName&dataElements:filter=domainType:eq:AGGREGATE&categoryCombos:fields=id,displayName
async function dataSetElementFieldData() {
    const d2 = await getInstance();
    const api = d2.Api.getApi();

    const { system, ...metadata } = await api.get('metadata', {
        'dataElements:fields': 'id,displayName',
        'dataElements:filter': 'domainType:eq:AGGREGATE',
        'categoryCombos:fields': 'id,displayName',
        'categoryCombos:filter': 'name:ne:default',
    });

    return {
        ...metadata
    };
}

const metadata$ = Observable.fromPromise(dataSetElementFieldData());

const enhancedDataElementField$ = (props$) => Observable
    .combineLatest(
        props$,
        metadata$,
        (props, metadata) => ({
            ...metadata,
            ...props,
        })
    )
    .map(({model, dataElements, categoryCombos, ...props}) => (
        <DataSetElementField
            {...props}
            dataSet={model}
            dataElements={dataElements}
            categoryCombos={categoryCombos}
            onChange={props.onChange}
        />
    ))
    .startWith(<LinearProgress />);

export default componentFromStream(enhancedDataElementField$);
