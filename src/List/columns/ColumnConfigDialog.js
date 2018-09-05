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
import listStore from '../list.store';
import { getTableColumnsForType } from '../../config/maintenance-models';
import { arrayMove } from 'react-sortable-hoc';
import { grey100, grey200 } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import ColumnsList from './DraggableColumns';
import camelCaseToUnderScores from 'd2-utilizr/lib/camelCaseToUnderscores';
import { magicallyUnwrapChildValues } from '../List.component';
import { compose, pullAll, sortedUniq } from 'lodash/fp';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    dataElement: {
        padding: '1rem 1rem',
        backgroundColor: grey200,
        marginBottom: '4px',
        borderRadius: '8px',
    },
    availableColumnsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    availableColumnsItem: {},
};

function getAvailableColumnsForType(model, defaultColumns) {
    const ignoreFieldTypes = ['COLLECTION', 'REFERENCE', 'COMPLEX'];

    const validations = model.modelValidations;

    let availableColumns = [];
    for (let fieldName in validations) {
        let field = validations[fieldName];

        if (!ignoreFieldTypes.includes(field.type)) {
            availableColumns.push(fieldName);
        }
    }
    return availableColumns;
}

const AvailableColumnsList = ({ columns, onClick }) => (
    <div style={styles.availableColumnsContainer}>
        {columns.map(column => (
            <div
                key={column.value}
                style={styles.dataElement}
                onClick={() => onClick(column)}
            >
                {column.displayValue}
            </div>
        ))}
    </div>
);
export class ColumnConfigDialog extends Component {
    constructor(props, context) {
        super(props, context);
        console.log(context);
        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        //this.t = (v) => v;

        const defaultColumns = getTableColumnsForType(props.modelType);
        const allAvailableColumns = getAvailableColumnsForType(
            context.d2.models[props.modelType],
            defaultColumns
        );
        const selectedColumns = defaultColumns;
        const availableColumns = pullAll(selectedColumns, allAvailableColumns)
            .filter((val, ind, self) => self.indexOf(val) === ind)
            .map(this.withTranslation)
            .sort()
            

        const selectedColumnsWithDisplay = selectedColumns.map(
            this.withTranslation
        );
        this.state = {
            default: defaultColumns,
            selectedColumns: selectedColumnsWithDisplay,
            availableColumns,
        };
    }

    withTranslation = value => ({
        value: value,
        displayValue: this.t(camelCaseToUnderScores(value)),
    });

    addSelection = (selectedColumns, newSelection) => {
        //TODO remove selection from available
        //add to selected
    };

    onAddAvailableColumn = column => {
        this.setState({
            selectedColumns: this.state.selectedColumns.concat(column),
        });
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            selectedColumns: arrayMove(
                this.state.selectedColumns,
                oldIndex,
                newIndex
            ),
        });
    };

    resetToDefault = () => {
        this.setState({
            selectedColumns: this.state.default,
        });
    };

    componentDidMount() {
        console.log(listStore.state);
        this.props.loadColumnsForModel(this.props.modelType);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.modelType !== newProps.modelType) {
            this.props.loadColumnsForModel(this.props.modelType);
        }
    }

    handleSaveOrder = () => {
        const selectedColumns = this.state.selectedColumns.map(
            col => col.value
        );
        this.props.setColumnsForModel(this.props.modelType, selectedColumns);
    };

    handleRemoveItem = (index, modelType) => {
        console.log(index, modelType);
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
                keyboardFocused={true}
                onClick={this.handleSaveOrder}
            />,
        ];

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.closeColumnsDialog}
                actions={actions}
                title={this.t('manage_columns')}
            >
                <h3>{this.t('selected_columns')}</h3>
                <ColumnsList
                    items={this.state.selectedColumns}
                    onSortEnd={this.onSortEnd}
                    onRemoveItem={this.handleRemoveItem}
                />
                <Divider />
                <h3>{this.t('available_columns')}</h3>
                <AvailableColumnsList
                    columns={this.state.availableColumns}
                    onClick={this.onAddAvailableColumn}
                />
            </Dialog>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    open: getDialogOpen(state),
    columns: getColumnsForModelType(state, ownProps.modelType).columns,
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
ColumnConfigDialog = connect(
    mapStateToProps,
    mapDispatchToProps
)(ColumnConfigDialog);

export default ColumnConfigDialog;
