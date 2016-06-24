import React, { Component, PropTypes } from 'react';
import optionSorter from './optionSorter';
import RaisedButton from 'material-ui/lib/raised-button';
import { getInstance } from 'd2/lib/d2';
import modelToEditStore from '../modelToEditStore';
import { Observable } from 'rx';
import snackActions from '../../Snackbar/snack.actions';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { optionsForOptionSetStore } from './stores.js';
import SortDialog, { setSortDialogOpenTo } from './sorting/SortDialog.component';

class OptionSorter extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sortedASC: {
                displayName: false,
                code: false,
            },
        };

        this._onSortBy = this._onSortBy.bind(this);
        this.getTranslation = this.context.d2.i18n.getTranslation.bind(this.context.d2.i18n);
    }

    render() {
        return (
            <div style={this.props.style}>
                <RaisedButton
                    style={this.props.buttonStyle}
                    onClick={() => this._onSortBy('displayName')}
                    disabled={this.state.isSorting}
                    label={this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_by_name')}
                />
                <RaisedButton
                    style={this.props.buttonStyle}
                    onClick={() => this._onSortBy('code')}
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

    _onSortBy(propertyName) {
        this.setState({
            isSorting: true,
        }, () => {
            optionSorter(modelToEditStore.getState().options.toArray(), propertyName, this.state.sortedASC[propertyName] ? 'DESC' : 'ASC')
                .flatMap(async (options) => {
                    const d2 = await getInstance();

                    return modelToEditStore
                        .take(1)
                        .map((modelToEdit) => ({
                            options: options.map(optionData => d2.models.option.create(optionData)),
                            modelToEdit,
                        }));
                })
                .concatAll()
                .map(({options, modelToEdit}) => {
                    modelToEdit.options.clear();
                    options.forEach((option) => {
                        modelToEdit.options.add(option);
                    });

                    modelToEditStore.setState(modelToEdit);
                    optionsForOptionSetStore.setState({
                        ...optionsForOptionSetStore.getState(),
                        options,
                    });
                    options.map(v => v.displayName);

                    snackActions.show({ message: 'options_sorted_locally_saving_to_server', translate: true });

                    return Observable.fromPromise(modelToEdit.save());
                })
                .concatAll()
                .subscribe(
                    () => {
                        this.setState({
                            sortedASC: {
                                ...this.state.sortedASC,
                                [propertyName]: !this.state.sortedASC[propertyName]
                            },
                            isSorting: false,
                        });
                        snackActions.show({ message: 'options_sorted_and_saved', action: 'ok', translate: true });
                    },
                    () => snackActions.show({ message: 'options_not_sorted', translate: true })
                );
        });
    }
}

export default addD2Context(OptionSorter);
