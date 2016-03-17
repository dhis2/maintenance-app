import React from 'react';
import { getInstance as getD2, config } from 'd2/lib/d2';
import Pager from 'd2/lib/pager/Pager';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

// Indicator expression manager
import IndicatorExpressionManagerContainer from './IndicatorExpressionManagerContainer.component';
import dataElementOperandStore from 'd2-ui/lib/indicator-expression-manager/dataElementOperand.store';
import dataElementOperandSelectorActions from 'd2-ui/lib/indicator-expression-manager/dataElementOperandSelector.actions';
import { Observable } from 'rx';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import modelToEditStore from './modelToEditStore';

import DataIndicatorGroupsAssignment from './DataIndicatorGroupsAssignment.component';
import DataElementGroupsAssignment from './data-element/DataElementGroupsAssignment.component';

config.i18n.strings.add('done');

const createFakePager = response => {
    // Fake the modelCollection since dataElementOperands do not have a valid uid
    return {
        pager: new Pager(response.pager, {
            list(pager) {
                return getD2()
                    .then(d2 => {
                        if (this.searchValue) {
                            return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', filter: [`name:ilike:${encodeURIComponent(this.searchValue)}`], totals: true });
                        }

                        return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', totals: true });
                    });
            },
        }),
        toArray() {
            return response.dataElementOperands;
        },
    };
};

dataElementOperandSelectorActions.loadList.subscribe(() => {
    getD2()
        .then(d2 => d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true }))
        .then(createFakePager)
        .then(collection => {
            dataElementOperandStore.setState(collection);
        });
});

dataElementOperandSelectorActions.search
    .throttle(500)
    .distinctUntilChanged(action => action.data)
    .map(action => {
        const searchPromise = getD2()
            .then(d2 => {
                if (action.data) {
                    return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', filter: [`name:ilike:${encodeURIComponent(action.data)}`] });
                }
                return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName' });
            })
            .then(createFakePager)
            .then(collection => {
                return {
                    complete: action.complete,
                    error: action.error,
                    collection: collection,
                };
            });

        return Observable.fromPromise(searchPromise);
    })
    .concatAll()
    .subscribe(actionResult => {
        dataElementOperandStore.setState(actionResult.collection);
        actionResult.complete();
    });

dataElementOperandSelectorActions.getNextPage
    .subscribe((action) => {
        const [pager, searchValue] = action.data;
        pager.pagingHandler.searchValue = searchValue;

        pager.getNextPage()
            .then(createFakePager)
            .then(collection => {
                return {
                    complete: action.complete,
                    error: action.error,
                    collection: collection,
                };
            })
            .then(actionResult => {
                dataElementOperandStore.setState(actionResult.collection);
                actionResult.complete();
            });
    });

dataElementOperandSelectorActions.getPreviousPage
    .subscribe((action) => {
        const [pager, searchValue] = action.data;
        pager.pagingHandler.searchValue = searchValue;

        pager.getPreviousPage()
            .then(createFakePager)
            .then(collection => {
                return {
                    complete: action.complete,
                    error: action.error,
                    collection: collection,
                };
            })
            .then(actionResult => {
                dataElementOperandStore.setState(actionResult.collection);
                actionResult.complete();
            });
    });

export default React.createClass({
    propTypes: {
        modelToEdit: React.PropTypes.object.isRequired,
        description: React.PropTypes.string.isRequired,
        formula: React.PropTypes.string.isRequired,
    },

    mixins: [Translate],

    getInitialState() {
        return {
            dialogValid: true,
        };
    },

    renderIndicatorFields() {
        const dialogActions = [
            // TODO: This button should "commit" the change to the model where a cancel button will discard any changes made
            <FlatButton label={this.getTranslation('done')} onTouchTap={this.closeDialog} disabled={!this.state.dialogValid} />,
        ];

        return (
            <div>
                <div style={{ marginTop: '2rem' }}>
                    <RaisedButton label={this.getTranslation('edit_numerator')} onClick={this.setNumerator} style={{ marginRight: '2rem' }} />
                    <RaisedButton label={this.getTranslation('edit_denominator')} onClick={this.setDenominator} />
                    <Dialog ref="dialog" modal actions={dialogActions} contentStyle={{ maxWidth: '90%' }} bodyStyle={{ padding: '0' }}>
                        {this.state ? this.renderExpressionManager() : null}
                    </Dialog>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <DataIndicatorGroupsAssignment source={this.props.modelToEdit} />
                </div>
            </div>
        );
    },

    renderDataElementFields() {
        return (
            <div style={{ marginTop: '2rem' }}>
                <DataElementGroupsAssignment source={this.props.modelToEdit} />
            </div>
        );
    },

    renderExpressionManager() {
        return (
            <IndicatorExpressionManagerContainer
                titleText={`Edit ${this.state.type}`}
                indicatorExpressionChanged={this.indicatorExpressionChanged}
                formula={this.props.modelToEdit[this.state.type] || ''}
                description={this.props.modelToEdit[`${this.state.type}Description`] || ''}
                ref="expressionManagerContainer"
            />
        );
    },

    render() {
        if (this.props.modelToEdit.modelDefinition.name === 'indicator') {
            return this.renderIndicatorFields();
        }

        if (this.props.modelToEdit.modelDefinition.name === 'dataElement') {
            return this.renderDataElementFields();
        }

        return null;
    },

    setNumerator() {
        this.setState({ type: 'numerator' }, () => this.refs.dialog.show());
    },

    setDenominator() {
        this.setState({ type: 'denominator' }, () => this.refs.dialog.show());
    },

    closeDialog() {
        this.refs.dialog.dismiss();
    },

    indicatorExpressionChanged(data) {
        this.setState({
            dialogValid: data.expressionStatus.isValid && Boolean(data.description.trim()),
        });

        if (data.expressionStatus.isValid) {
            this.props.modelToEdit[this.state.type] = data.formula;
            this.props.modelToEdit[`${this.state.type}Description`] = data.description;

            modelToEditStore.setState(this.props.modelToEdit);
        }
    },
});
