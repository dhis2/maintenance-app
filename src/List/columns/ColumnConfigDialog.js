import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog/Dialog';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    closeColumnsDialog,
    loadColumnsForModel,
    setColumnsForModel,
} from './actions';
import { getColumnsForModelType, getDialogOpen } from './selectors';
import { getTableColumnsForType } from '../../config/maintenance-models';
import { arrayMove } from 'react-sortable-hoc';
import { grey100, grey200 } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import SortableColumnsList from './SortableColumns';
import camelCaseToUnderScores from 'd2-utilizr/lib/camelCaseToUnderscores';
import FlatButton from 'material-ui/FlatButton';
import { AvailableDataElement as AvailableColumn } from '../../EditModel/event-program/create-data-entry-form/DataElementPicker.component';

const styles = {
    availableColumnElement: {
        flex: '1 0 25%',
        margin: '0 5px 0 0',
        maxWidth: '235px',
    },
    availableColumnsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    disabledElement: {},
    availableColumnsItem: {},
};

function getAvailableColumnsForModel(model) {
    const ignoreFieldTypes = ['COLLECTION', 'REFERENCE', 'COMPLEX'];
    const ignoreFieldNames = ['name'];
    const validations = model.modelValidations;

    let availableColumns = ['user[name]'];
    for (let fieldName in validations) {
        let field = validations[fieldName];

        if (
            !ignoreFieldTypes.includes(field.type) &&
            !ignoreFieldNames.includes(fieldName)
        ) {
            availableColumns.push(fieldName);
        }
    }
    return availableColumns;
}

const AvailableColumnsList = ({ columns, onClick, selectedColumns }) => {
    return (
        <div style={styles.availableColumnsContainer}>
            {columns.map(column => {
                //adhere to availabledataelement api
                const toDataElement = {
                    id: column.value,
                    displayName: column.displayValue,
                };
                const active = selectedColumns.find(
                    col => col.value === column.value
                );
                return (
                    <div style={styles.availableColumnElement}>
                        <AvailableColumn
                            dataElement={toDataElement}
                            pickDataElement={() => onClick(column)}
                            active={!!active}
                            key={column.value}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export class ColumnConfigDialog extends Component {
    constructor(props, context) {
        super(props, context);
        const loadedColumns = this.props.userSelectedColumns;
        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);

        const defaultColumns = getTableColumnsForType(
            props.modelType,
            true,
            true
        ).map(this.withDisplayProps);

        const availableColumns = getAvailableColumnsForModel(
            context.d2.models[props.modelType]
        )
            .map(this.withDisplayProps)
            .concat(defaultColumns)
            .filter(
                (val, ind, self) =>
                    ind === self.findIndex(v => v.value === val.value) //remove duplicates
            )
            .sort((a, b) => a.displayValue.localeCompare(b.displayValue));

        //use default if columns are not specified by user
        const selectedColumns =
            loadedColumns.length < 1
                ? defaultColumns
                : loadedColumns.map(this.withDisplayProps);

        this.state = {
            defaultColumns: defaultColumns,
            selectedColumns: selectedColumns,
            availableColumns,
            error: null,
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.props.userSelectedColumns !== newProps.userSelectedColumns) {
            if (newProps.userSelectedColumns.length < 1) {
                return this.setState(state => ({
                    selectedColumns: state.defaultColumns,
                }));
            }
            const selectedColumnsWithDisplay = newProps.userSelectedColumns.map(
                this.withDisplayProps
            );
            this.setState({
                selectedColumns: selectedColumnsWithDisplay,
            });
        }
    }

    withDisplayProps = value => ({
        value: value,
        displayValue: this.t(
            camelCaseToUnderScores(value.replace(/(\w*)\[(\w*)]/, '$1___$2'))
        ),
    });

    handleAddColumn = column => {
        this.setState({
            selectedColumns: this.state.selectedColumns.concat(column),
            error: null,
        });
    };

    handleOnSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            selectedColumns: arrayMove(
                this.state.selectedColumns,
                oldIndex,
                newIndex
            ),
        });
    };

    handleResetToDefault = () => {
        this.setState({
            selectedColumns: this.state.default,
            error: null,
        });
    };

    handleSaveOrder = () => {
        if (this.state.selectedColumns === this.state.defaultColumns) {
            this.props.setColumnsForModel(this.props.modelType, []);
            return;
        }
        const selectedColumns = this.state.selectedColumns.map(
            col => col.value
        );
        this.props.setColumnsForModel(this.props.modelType, selectedColumns);
    };

    handleRemoveItem = (index, modelType) => {
        const selected = this.state.selectedColumns;
        if (selected.length < 2) {
            return this.setState({
                error: 'Must have at least one column selected.',
            });
        }

        const newSelected = [
            ...selected.slice(0, index),
            ...selected.slice(index + 1),
        ];

        this.setState(state => ({
            selectedColumns: newSelected,
        }));
    };

    handleResetToDefault = () => {
        this.setState(state => ({ selectedColumns: state.defaultColumns }));
    };

    render() {
        const actions = [
            <FlatButton
                label={this.t('cancel')}
                primary={true}
                onClick={this.props.closeColumnsDialog}
            />,
            <FlatButton
                label={this.t('save')}
                primary={true}
                onClick={this.handleSaveOrder}
            />,
        ];

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.closeColumnsDialog}
                actions={actions}
                autoScrollBodyContent
                title={this.t('manage_columns')}
            >
                <h3>{this.t('selected_columns')}</h3>
                <SortableColumnsList
                    items={this.state.selectedColumns}
                    onSortEnd={this.handleOnSortEnd}
                    onRemoveItem={this.handleRemoveItem}
                />
                <FlatButton
                    label={this.t('reset_to_default')}
                    onClick={this.handleResetToDefault}
                    secondary
                    disabled={
                        this.state.selectedColumns === this.state.defaultColumns
                    }
                />
                {this.state.error}
                <Divider />
                <h3>{this.t('available_columns')}</h3>
                <AvailableColumnsList
                    columns={this.state.availableColumns}
                    onClick={this.handleAddColumn}
                    selectedColumns={this.state.selectedColumns}
                />
            </Dialog>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    open: getDialogOpen(state),
    userSelectedColumns: getColumnsForModelType(state, ownProps.modelType),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            closeColumnsDialog,
            setColumnsForModel,
        },
        dispatch
    ),
    loadColumnsForModel(modelType) {
        dispatch(loadColumnsForModel(modelType));
    },
});

ColumnConfigDialog.contextTypes = {
    d2: PropTypes.object,
};

ColumnConfigDialog.propTypes = {
    open: PropTypes.bool,
    columns: PropTypes.array,
    modelType: PropTypes.string,
};
const ColumnConfigDialogConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(ColumnConfigDialog);

export default ColumnConfigDialogConnected;
