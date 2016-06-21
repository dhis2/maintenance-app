import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';
import CircularProgress from 'material-ui/lib/circular-progress';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';
import snackActions from '../../Snackbar/snack.actions';
import { updateAPIUrlWithBaseUrlVersionNumber } from 'd2/lib/lib/utils';

const styles = {
    groupEditorWrap: {
        paddingBottom: '2rem',
    },

    formButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
    }
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

        itemsAvailableStore.setState(props.dataElementOperands
            .map(operand => {
                return {
                    text: operand.displayName,
                    value: [operand.dataElementId, operand.optionComboId].join('.'),
                };
            }));

        itemsSelectedStore.setState(
            props.model.compulsoryDataElementOperands
                .filter(deo => deo.dataElement && deo.categoryOptionCombo)
                .map(deo => [deo.dataElement.id, deo.categoryOptionCombo.id].join('.'))
        );
    }

    render() {
        const isLoaded = Boolean(this.props.dataElementOperands);
        const saveButtonText = this.state.isSaving ? this.i18n.getTranslation('saving') : this.i18n.getTranslation('save');

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                autoScrollBodyContent={true}
                modal={true}
            >
                <div>
                    <Heading>{this.i18n.getTranslation('edit_compulsory_data_elements')} - {this.props.model.displayName}</Heading>
                    {isLoaded ? this.renderDialogContent() : <CircularProgress indetermined />}
                    <div style={styles.formButtons}>
                        <RaisedButton labelColor="white" disabledLabelColor="#666" disabled={this.state.isSaving} primary onClick={this._saveCollection} label={saveButtonText} />
                        <FlatButton disabled={this.state.isSaving} style={{marginLeft: '1rem'}} onClick={this.props.onRequestClose}>{this.i18n.getTranslation('close')}</FlatButton>
                    </div>
                </div>
            </Dialog>
        );
    }

    renderDialogContent() {
        return (
            <div style={styles.groupEditorWrap}>
                <GroupEditor
                    itemStore={itemsAvailableStore}
                    assignedItemStore={itemsSelectedStore}
                    onAssignItems={this._assignItems}
                    onRemoveItems={this._removeItems}
                    height={250}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }

    _assignItems = async (selectedItems) => {
        const newState = itemsSelectedStore.getState().concat(selectedItems);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    }

    _removeItems = (selectedItems) => {
        const newState = itemsSelectedStore.getState()
            .filter(item => selectedItems.indexOf(item) === -1);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    }

    _saveCollection = () => {
        const collectionToSave = itemsSelectedStore.getState()
            .map(combinationId => combinationId.split('.'))
            .filter(ids => ids.length === 2)
            .map(([dataElementId, categoryOptionComboId]) => {
                return {
                    dataElement: {
                        id: dataElementId,
                    },
                    categoryOptionCombo: {
                        id: categoryOptionComboId,
                    }
                };
            });

        this.setState({
            isSaving: true,
        });

        const payload = getOwnedPropertyJSON.bind(this.props.model.modelDefinition)(this.props.model);
        const d2 = this.context.d2;
        const api = d2.Api.getApi();

        payload.compulsoryDataElementOperands = collectionToSave;

        // TODO: Should be done propery without modifying props and preferably without saving the whole model
        this.props.model.compulsoryDataElementOperands = collectionToSave;
        api.update(updateAPIUrlWithBaseUrlVersionNumber(this.props.model.href, api.baseUrl), payload, false)
            .then(() => {
                snackActions.show({
                    message: 'saved_compulsory_data_elements',
                    action: 'ok',
                    translate: true,
                });
            })
            .catch(() => {
                snackActions.show({
                    message: 'failed_to_save_compulsory_data_elements',
                    translate: true,
                });
            })
            .then(() => {
                this.setState({ isSaving: false});
                this.props.onRequestClose();
            });

    }
}

export default addD2Context(CompulsoryDataElementOperandDialog);
