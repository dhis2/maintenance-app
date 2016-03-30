import React from 'react';
import Store from 'd2-ui/lib/store/Store';
import { getInstance } from 'd2/lib/d2';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
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
            return d2.models[this.props.referenceType]
                .filter().on('name').notEqual('default')
                .list({ paging: false, fields: 'displayName|rename(name),id,level' });
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
