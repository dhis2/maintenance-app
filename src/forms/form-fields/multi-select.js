import React from 'react';
import Store from 'd2-ui/lib/store/Store';
import { getInstance } from 'd2/lib/d2';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import GroupEditorWithOrdering from 'd2-ui/lib/group-editor/GroupEditorWithOrdering.component';
import Action from 'd2-ui/lib/action/Action';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import TextField from 'material-ui/lib/text-field';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import { config } from 'd2/lib/d2';
import log from 'loglevel';

config.i18n.strings.add('search_available_selected_items');

export const multiSelectActions = Action.createActionsFromNames([
    'addItemsToModelCollection',
    'removeItemsFromModelCollection',
]);

function unique(values) {
    return Array.from((new Set(values)).values());
}

function filterModelsMapOnItemIds(map, items) {
    return Array
        .from(map.values())
        .filter(model => items.indexOf(model.id) !== -1);
}

multiSelectActions.addItemsToModelCollection
    .subscribe(({ data, complete, error }) => {
        try {
            const [modelsToAdd, propertyName, model] = data;

            if (!model[propertyName]) {
                error(`Model does not have property called '${propertyName}'`);
            }

            modelsToAdd
                .forEach(itemToAdd => {
                    model[propertyName].add(itemToAdd);
                });

            complete();
        } catch (e) {
            log.error(e);
        }
    });

multiSelectActions.removeItemsFromModelCollection
    .subscribe(({ data, complete, error }) => {
        const [modelsToRemove, propertyName, model] = data;

        if (!model[propertyName]) {
            error(`Model does not have property called '${propertyName}'`);
        }

        modelsToRemove
            .forEach(itemToRemove => {
                model[propertyName].remove(itemToRemove);
            });

        complete();
    });

export default React.createClass({
    propTypes: {
        referenceType: React.PropTypes.string.isRequired,
        referenceProperty: React.PropTypes.string.isRequired,
        model: React.PropTypes.object.isRequired,
        labelText: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.shape({
            values: React.PropTypes.func.isRequired,
        }).isRequired,
    },

    mixins: [Translate],

    getInitialState() {
        const itemStore = Store.create();
        const assignedItemStore = Store.create();

        itemStore.state = [];
        assignedItemStore.state = [];

        return {
            itemStore,
            assignedItemStore,
            filterText: '',
        };
    },

    componentWillMount() {
        if (!this.props.referenceType) {
            return;
        }

        getInstance()
            .then(this.loadAvailableItems)
            .then(this.populateItemStore)
            .then(this.populateAssignedStore);
    },

    renderGroupEditor() {
        if (this.props.model.modelDefinition.modelValidations[this.props.referenceProperty] &&
            this.props.model.modelDefinition.modelValidations[this.props.referenceProperty].ordered &&
            this.props.referenceProperty !== 'aggregationLevels' /* TODO: The aggregation levels should either not be "ordered" or should be returned from the API properly */) {
            return (
                <GroupEditorWithOrdering
                    itemStore={this.state.itemStore}
                    assignedItemStore={this.state.assignedItemStore}
                    onAssignItems={this._assignItems}
                    onRemoveItems={this._removeItems}
                    onOrderChanged={this._orderChanged}
                    height={250}
                    filterText={this.state.filterText}
                />
            );
        }

        return (
            <GroupEditor
                itemStore={this.state.itemStore}
                assignedItemStore={this.state.assignedItemStore}
                onAssignItems={this._assignItems}
                onRemoveItems={this._removeItems}
                height={250}
                filterText={this.state.filterText}
            />
        );
    },

    render() {
        const labelStyle = {
            float: 'left',
            position: 'relative',
            display: 'block',
            width: 'calc(100% - 60px)',
            lineHeight: '24px',
            color: 'rgba(0,0,0,0.3)',
            marginTop: '1rem',
            fontSize: 16,
        };

        return (
            <div>
                <label style={labelStyle}>{this.props.labelText || ''}</label>
                <TextField
                    fullWidth
                    hintText={this.getTranslation('search_available_selected_items')}
                    defaultValue={this.state.filterText}
                    onChange={this._setFilterText}
                />
                {this.renderGroupEditor()}
                <div style={{ clear: 'both', height: '2rem', width: '100%' }} />
            </div>
        );
    },

    _orderChanged(newOrder) {
        const itemList = this.state.itemStore.getState();

        // TODO: Move the following mutation to an `Action`
        // Reset the ModelCollectionProperty / ModelCollection
        this.props.model[this.props.referenceProperty].clear();

        // Add the items back in the correct order
        newOrder.forEach(item => {
            if (itemList.has(item)) {
                this.props.model[this.props.referenceProperty].add(itemList.get(item));
            }
        });

        // Set the state to the store to emit the value to all subscribers
        this.state.assignedItemStore.setState(this.props.model[this.props.referenceProperty].toArray().map(value => value.id));
    },

    _assignItems(items) {
        if (this.props.referenceProperty === 'aggregationLevels') {
            const newList = Array.from((new Set((this.props.model[this.props.referenceProperty] || []).concat(items.map(Number)))).values());

            this.props.onChange({
                target: {
                    value: newList,
                },
            });
            this.state.assignedItemStore.setState(newList);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const modelsToAdd = filterModelsMapOnItemIds(this.state.itemStore.state, items);

            multiSelectActions.addItemsToModelCollection(modelsToAdd, this.props.referenceProperty, this.props.model)
                .subscribe(() => {
                    const newAssignedItems = []
                        .concat(this.state.assignedItemStore.getState())
                        .concat(items)
                        .filter(value => value);

                    this.state.assignedItemStore.setState(unique([].concat(newAssignedItems)));

                    this.props.onChange({
                        target: {
                            value: this.props.model[this.props.referenceProperty],
                        },
                    });

                    resolve();
                }, reject);
        });
    },

    _removeItems(items) {
        if (this.props.referenceProperty === 'aggregationLevels') {
            const newList = Array.from((new Set((this.props.model[this.props.referenceProperty] || []).filter(v => items.map(Number).indexOf(v) === -1))).values());

            this.props.onChange({
                target: {
                    value: newList,
                },
            });
            this.state.assignedItemStore.setState(newList);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const modelsToRemove = filterModelsMapOnItemIds(this.state.itemStore.state, items);

            multiSelectActions.removeItemsFromModelCollection(modelsToRemove, this.props.referenceProperty, this.props.model)
                .subscribe(() => {
                    const newAssignedItems = []
                        .concat(this.state.assignedItemStore.getState())
                        .filter(item => items.indexOf(item) === -1)
                        .filter(value => value);

                    this.updateForm(newAssignedItems);
                    resolve();
                }, reject);
        });
    },

    _setFilterText(event) {
        this.setState({
            filterText: event.target.value,
        });
    },

    updateForm(newAssignedItems) {
        this.state.assignedItemStore.setState(unique([].concat(newAssignedItems)));

        this.props.onChange({
            target: {
                value: this.props.model[this.props.referenceProperty],
            },
        });
    },

    loadAvailableItems(d2) {
        if (d2.models[this.props.referenceType]) {
            const multiSelectSourceModelDefinition = d2.models[this.props.referenceType];

            // When there are any special filters set we need to apply them to the modelDefinition before loading
            // the items. An array of filters can be passed to the filter property of the options to the .list() call
            // As the default should always be filtered out we concat the set filters with default filter that filters
            // out anything with the name 'default'
            const filters = ['name:ne:default']
                .concat(this.props.queryParamFilter)
                .filter(f => f);

            return multiSelectSourceModelDefinition
                .list({ paging: false, fields: 'displayName|rename(name),id,level', filter: filters });
        }
        return Promise.reject(`${this.props.referenceType} is not a model on d2.models`);
    },

    populateItemStore(availableItems) {
        if (this.props.referenceProperty === 'aggregationLevels') {
            this.state.itemStore.setState(Array.from(availableItems.values()).map((model) => {
                return {
                    value: model.level,
                    text: model.displayName || model.name,
                };
            }));
            return;
        }

        this.state.itemStore.setState(availableItems);
    },

    populateAssignedStore() {
        if (!this.props.value) {
            return this.state.assignedItemStore.setState([]);
        }

        if (Array.isArray(this.props.value)) {
            this.state.assignedItemStore.setState(Array.from(this.props.value));
        } else {
            this.state.assignedItemStore.setState(Array.from(this.props.value.values()).map(value => value.id));
        }
    },
});
