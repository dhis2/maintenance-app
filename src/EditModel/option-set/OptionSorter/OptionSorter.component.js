import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';

import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { getInstance } from 'd2/lib/d2';

import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import SortDialog, { setSortDialogOpenTo } from './SortDialog.component';
import optionSorter from './optionSorter';

import snackActions from '../../../Snackbar/snack.actions';

import { optionsForOptionSetStore } from '../stores';
import modelToEditStore from '../../modelToEditStore';

class OptionSorter extends Component {
    state = {
        sortedASC: {
            displayName: false,
            code: false,
        },
    };

    onSetIsSorting = (propertyName) => {
        const optionsToSort = modelToEditStore.getState().options.toArray();
        const sortOrder = this.state.sortedASC[propertyName]
            ? 'DESC'
            : 'ASC';

        optionSorter(optionsToSort, propertyName, sortOrder)
            .flatMap(this.addSortedOptionsToStore)
            .concatAll()
            .map(this.addSortedOptionsToModel)
            .concatAll()
            .subscribe(
                () => this.onSortingSuccess(propertyName),
                () => this.showMessage('options_not_sorted', true, 'ok'),
            );
    };

    onSortBy = (propertyName) => {
        this.setState(
            { isSorting: true },
            this.onSetIsSorting(propertyName),
        );
    }

    onSortingSuccess = (propertyName) => {
        this.setState({
            sortedASC: {
                ...this.state.sortedASC,
                [propertyName]: !this.state.sortedASC[propertyName],
            },
            isSorting: false,
        });
        this.showMessage('options_sorted_and_saved', true);
    }

    getTranslation = message => this.context.d2.i18n.getTranslation(message);

    addSortedOptionsToModel = ({ options, modelToEdit }) => {
        modelToEdit.options.clear();
        options.forEach(option => modelToEdit.options.add(option));

        modelToEditStore.setState(modelToEdit);
        optionsForOptionSetStore.setState({
            ...optionsForOptionSetStore.getState(),
            options,
        });
        options.map(v => v.displayName);

        this.showMessage('options_sorted_locally_saving_to_server', true);
        return Observable.fromPromise(modelToEdit.save());
    }

    addSortedOptionsToStore = async (options) => {
        const d2 = await getInstance();
        const newOptions = options.map(optionData =>
            d2.models.option.create(optionData));

        return modelToEditStore
            .take(1)
            .map(modelToEdit => ({
                options: newOptions,
                modelToEdit,
            }));
    }

    showMessage = (message, translate = false, action = undefined) => {
        snackActions.show({ message, action, translate });
    }

    render() {
        return (
            <div style={this.props.style}>
                <RaisedButton
                    style={this.props.buttonStyle}
                    onClick={() => this.onSortBy('displayName')}
                    disabled={this.state.isSorting}
                    label={this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_by_name')}
                />
                <RaisedButton
                    style={this.props.buttonStyle}
                    onClick={() => this.onSortBy('code')}
                    disabled={this.state.isSorting}
                    label={this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_by_code')}
                />
                <RaisedButton
                    style={this.props.buttonStyle}
                    onClick={() => setSortDialogOpenTo(true)}
                    disabled={this.state.isSorting}
                    label={this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_manually')}
                />
                <SortDialog />
            </div>
        );
    }
}

OptionSorter.propTypes = {
    buttonStyle: PropTypes.object,
    style: PropTypes.object,
};

OptionSorter.defaultProps = {
    buttonStyle: {},
    style: {},
};


export default addD2Context(OptionSorter);
