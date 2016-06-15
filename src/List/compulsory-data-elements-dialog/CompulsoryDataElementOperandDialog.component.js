import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';
import CircularProgress from 'material-ui/lib/circular-progress';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';
import Store from 'd2-ui/lib/store/Store';

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
                .map(deo => [deo.dataElement.id, deo.categoryOptionCombo.id].join('.'))
        );
    }

    render() {
        const isLoaded = Boolean(this.props.dataElementOperands);

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                autoScrollBodyContent={true}
            >
                <div>
                    <Heading>{this.i18n.getTranslation('edit_compulsory_data_elements')} - {this.props.model.displayName}</Heading>
                    {isLoaded ? this.renderDialogContent() : <CircularProgress indetermined />}
                    <div style={styles.formButtons}>
                        <RaisedButton primary>{this.i18n.getTranslation('save')}</RaisedButton>
                        <FlatButton style={{marginLeft: '1rem'}} onClick={this.props.onRequestClose}>{this.i18n.getTranslation('close')}</FlatButton>
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
                    assignedItemStore={itemsSelectedStore || []}
                    onAssignItems={this._assignItems}
                    onRemoveItems={this._removeItems}
                    height={250}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
}

export default addD2Context(CompulsoryDataElementOperandDialog);
