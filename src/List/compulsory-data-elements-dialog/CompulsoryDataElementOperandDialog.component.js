/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';

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
    innerDialogStyle: {
        marginBottom: '3.5rem',
    },
    flatButtonStyle: {
        marginRight: '1rem',
    },
    textFieldStyle: {
        width: '100%',
    },
    dialogContentStyle: {
        maxWidth: 'none',
        width: '95%',
    },
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

        if (props.dataElementOperands && props.model) {
            itemsAvailableStore.setState(
                props.dataElementOperands.map(operand => ({
                    text: operand.displayName,
                    value: `${operand.dataElementId}.${operand.optionComboId}`,
                })),
            );

            itemsSelectedStore.setState(
                props.model.compulsoryDataElementOperands
                    .filter(deo => deo.dataElement && deo.categoryOptionCombo)
                    .map(deo => `${deo.dataElement.id}.${deo.categoryOptionCombo.id}`),
            );
        }
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.open) {
            itemsAvailableStore.setState(undefined);
            itemsSelectedStore.setState([]);
        } else if (newProps.dataElementOperands && newProps.model) {
            itemsAvailableStore.setState(
                newProps.dataElementOperands.map(operand => ({
                    text: operand.displayName,
                    value: [operand.dataElementId, operand.optionComboId].join('.'),
                })),
            );

            itemsSelectedStore.setState(
                newProps.model.compulsoryDataElementOperands
                    .filter(deo => deo.dataElement && deo.categoryOptionCombo)
                    .map(deo => [deo.dataElement.id, deo.categoryOptionCombo.id].join('.')),
            );
        }
    }

    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    changeFilter = (event) => {
        this.setState({ filterText: event.target.value });
    };

    assignItems = async (selectedItems) => {
        const newState = itemsSelectedStore.getState().concat(selectedItems);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    };

    removeItems = (selectedItems) => {
        const newState = itemsSelectedStore.getState()
            .filter(item => selectedItems.indexOf(item) === -1);

        itemsSelectedStore.setState(newState);

        return Promise.resolve(true);
    };

    saveCollection = () => {
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

    render() {
        const saveButtonText = this.state.isSaving
            ? this.getTranslation('saving')
            : this.getTranslation('save');

        const dialogActions = [
            <FlatButton
                disabled={this.state.isSaving}
                style={styles.flatButtonStyle}
                onClick={this.props.onRequestClose}
                label={this.getTranslation('close')}
            />,
            <RaisedButton
                labelColor="white"
                disabled={this.state.isSaving}
                primary
                onClick={this.saveCollection}
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
                contentStyle={styles.dialogContent}
            >
                <div style={styles.innerDialogStyle}>
                    <Heading>
                        {this.getTranslation('edit_compulsory_data_elements')} - {get('displayName', this.props.model)}
                    </Heading>
                    <TextField
                        floatingLabelText={this.getTranslation('filter')}
                        style={styles.textFieldStyle}
                        onChange={this.changeFilter}
                    />
                    <GroupEditor
                        itemStore={itemsAvailableStore}
                        assignedItemStore={itemsSelectedStore}
                        onAssignItems={this.assignItems}
                        onRemoveItems={this.removeItems}
                        height={350}
                        filterText={this.state.filterText}
                    />
                </div>
            </Dialog>
        );
    }
}

CompulsoryDataElementOperandDialog.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    model: PropTypes.object,
    dataElementOperands: PropTypes.array,
    open: PropTypes.bool,
};

CompulsoryDataElementOperandDialog.defaultProps = {
    dataElementOperands: null,
    model: null,
    open: false,
};

export default addD2Context(CompulsoryDataElementOperandDialog);
