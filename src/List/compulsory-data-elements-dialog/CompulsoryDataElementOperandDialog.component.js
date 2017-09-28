import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import TextField from 'material-ui/TextField/TextField';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';
import snackActions from '../../Snackbar/snack.actions';

const styles = {
    groupEditorWrap: {
        paddingBottom: '2rem',
    },

    formButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
};

const itemsAvailableStore = Store.create();
const itemsSelectedStore = Store.create();

// TODO: Copied from d2 (Should find a better way to do this)
function getOwnedPropertyJSON(model) {
    const objectToSave = {};
    const ownedProperties = this.getOwnedPropertyNames();
    const collectionProperties = model.getCollectionChildrenPropertyNames();

    Object.keys(this.modelValidations).forEach((propertyName) => {
        if (ownedProperties.indexOf(propertyName) >= 0) {
            if (model.dataValues[propertyName] !== undefined && model.dataValues[propertyName] !== null) {
                // Handle collections and plain values different
                if (collectionProperties.indexOf(propertyName) === -1) {
                    objectToSave[propertyName] = model.dataValues[propertyName];
                } else {
                    // compulsoryDataElementOperands is not an array of models.
                    // TODO: This is not the proper way to do this. We should check if the array contains Models
                    if (propertyName === 'compulsoryDataElementOperands') {
                        objectToSave[propertyName] = model.dataValues[propertyName];
                        return;
                    }

                    // Transform an object collection to an array of objects with id properties
                    objectToSave[propertyName] = Array
                        .from(model.dataValues[propertyName].values())
                        .filter(value => value.id)
                        .map((childModel) => {
                            // Legends can be saved as part of the LegendSet object.
                            // To make this work properly we will return all of the properties for the items in the collection
                            // instead of just the `id` fields
                            if (model.modelDefinition && model.modelDefinition.name === 'legendSet') {
                                return getOwnedPropertyJSON.call(childModel.modelDefinition, childModel);
                            }

                            // For any other types we return an object with just an id
                            return { id: childModel.id };
                        });
                }
            }
        }
    });

    return objectToSave;
}

class CompulsoryDataElementOperandDialog extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            filterText: '',
            isSaving: false,
        };

        this.i18n = context.d2.i18n;

        if (props.dataElementOperands && props.model) {
            itemsAvailableStore.setState(
                props.dataElementOperands.map(operand => ({
                    text: operand.displayName,
                    value: `${operand.dataElementId}.${operand.optionComboId}`,
                }))
            );

            itemsSelectedStore.setState(
                props.model.compulsoryDataElementOperands
                    .filter(deo => deo.dataElement && deo.categoryOptionCombo)
                    .map(deo => `${deo.dataElement.id}.${deo.categoryOptionCombo.id}`)
            );
        }
    }

    componentWillReceiveProps(props) {
        if (!props.open) {
            itemsAvailableStore.setState(undefined);
            itemsSelectedStore.setState([]);
        } else if (props.dataElementOperands && props.model) {
            itemsAvailableStore.setState(
                props.dataElementOperands.map(operand => ({
                    text: operand.displayName,
                    value: [operand.dataElementId, operand.optionComboId].join('.'),
                }))
            );

            itemsSelectedStore.setState(
                props.model.compulsoryDataElementOperands
                    .filter(deo => deo.dataElement && deo.categoryOptionCombo)
                    .map(deo => [deo.dataElement.id, deo.categoryOptionCombo.id].join('.'))
            );
        }
    }

    render() {
        const saveButtonText = this.state.isSaving ? this.i18n.getTranslation('saving') : this.i18n.getTranslation('save');
        const dialogActions = [
            <FlatButton
                disabled={this.state.isSaving}
                style={{ marginRight: '1rem' }}
                onClick={this.props.onRequestClose}
                label={this.i18n.getTranslation('close')}
            />,
            <RaisedButton
                labelColor="white"
                disabled={this.state.isSaving}
                primary
                onClick={this._saveCollection}
                label={saveButtonText}
            />,
        ];

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                autoScrollBodyContent
                modal
                actions={dialogActions}
                contentStyle={{ maxWidth: 'none', width: '95%' }}
            >
                <div style={{ marginBottom: '3.5rem' }}>
                    <Heading>{this.i18n.getTranslation('edit_compulsory_data_elements')} - {this.props.model && this.props.model.displayName}</Heading>
                    <TextField
                        floatingLabelText={this.i18n.getTranslation('filter')}
                        style={{ width: '100%' }}
                        onChange={this._changeFilter}
                    />
                    <GroupEditor
                        itemStore={itemsAvailableStore}
                        assignedItemStore={itemsSelectedStore}
                        onAssignItems={this._assignItems}
                        onRemoveItems={this._removeItems}
                        height={350}
                        filterText={this.state.filterText}
                    />
                </div>
            </Dialog>
        );
    }

    _changeFilter = (event) => {
        this.setState({ filterText: event.target.value });
    };

    _assignItems = async (selectedItems) => {
        const newState = itemsSelectedStore.getState().concat(selectedItems);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    };

    _removeItems = (selectedItems) => {
        const newState = itemsSelectedStore.getState()
            .filter(item => selectedItems.indexOf(item) === -1);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    };

    _saveCollection = () => {
        const collectionToSave = itemsSelectedStore.getState()
            .map(combinationId => combinationId.split('.'))
            .filter(ids => ids.length === 2)
            .map(([dataElementId, categoryOptionComboId]) => ({
                dataElement: {
                    id: dataElementId,
                },
                categoryOptionCombo: {
                    id: categoryOptionComboId,
                },
            }));

        this.setState({
            isSaving: true,
        });

        const payload = getOwnedPropertyJSON.bind(this.props.model.modelDefinition)(this.props.model);
        const d2 = this.context.d2;

        // TODO: Should be done propery without modifying props and preferably without saving the whole model
        this.props.model.compulsoryDataElementOperands = collectionToSave;
        this.props.model.save()
            .then(() => {
                snackActions.show({
                    message: 'saved_compulsory_data_elements',
                    translate: true,
                });
            })
            .catch(() => {
                snackActions.show({
                    message: 'failed_to_save_compulsory_data_elements',
                    action: 'ok',
                    translate: true,
                });
            })
            .then(() => {
                this.setState({ isSaving: false });
                this.props.onRequestClose();
            });
    };
}

export default addD2Context(CompulsoryDataElementOperandDialog);
