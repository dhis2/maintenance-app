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

        console.log('Creating only once');
        itemsSelectedStore.setState(
            props.model.compulsoryDataElementOperands
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
                model={true}
            >
                <div>
                    <Heading>{this.i18n.getTranslation('edit_compulsory_data_elements')} - {this.props.model.displayName}</Heading>
                    {isLoaded ? this.renderDialogContent() : <CircularProgress indetermined />}
                    <div style={styles.formButtons}>
                        <RaisedButton disabled={this.state.isSaving} primary onClick={this._saveCollection}>{saveButtonText}</RaisedButton>
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

        // TODO: Should be done propery without modifying props and preferably without saving the whole model
        this.props.model.compulsoryDataElementOperands = collectionToSave;
        return this.props.model.save()
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
