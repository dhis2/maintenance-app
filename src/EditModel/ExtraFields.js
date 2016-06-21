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
import modelToEditStore from './modelToEditStore';

import DataIndicatorGroupsAssignment from './DataIndicatorGroupsAssignment.component';
import DataElementGroupsAssignment from './data-element/DataElementGroupsAssignment.component';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

config.i18n.strings.add('done');

const createFakePager = response => {
    // Fake the modelCollection since dataElementOperands do not have a valid uid
    return {
        pager: new Pager(response.pager, {
            list(pager) {
                return getD2()
                    .then(d2 => {
                        if (this.searchValue) {
                            return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', filter: ['dataElement.domainType:eq:AGGREGATE', `name:ilike:${encodeURIComponent(this.searchValue)}`], totals: true });
                        }

                        return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] });
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
        .then(d2 => d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] }))
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
                    return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE', `name:ilike:${encodeURIComponent(action.data)}`] });
                }
                return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] });
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

class IndicatorExtraFields extends React.Component {
    constructor(props, state) {
        super(props, state);
        this.state = {
            dialogValid: true,
            dialogOpen: false,
        };

        this.setNumerator = this.setNumerator.bind(this);
        this.setDenominator = this.setDenominator.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.saveToModelAndCloseDialog = this.saveToModelAndCloseDialog.bind(this);
        this.indicatorExpressionChanged = this.indicatorExpressionChanged.bind(this);
    }

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
    }

    render() {
        const dialogActions = [
            // TODO: This button should "commit" the change to the model where a cancel button will discard any changes made
            <FlatButton label={this.context.d2.i18n.getTranslation('cancel')} onTouchTap={this.closeDialog} />,
            <FlatButton label={this.context.d2.i18n.getTranslation('done')} onTouchTap={this.saveToModelAndCloseDialog} disabled={!this.state.dialogValid} />,
        ];

        return (
            <div>
                <div style={{ marginTop: '2rem' }}>
                    <RaisedButton label={this.context.d2.i18n.getTranslation('edit_numerator')} onClick={this.setNumerator} style={{ marginRight: '2rem' }} />
                    <RaisedButton label={this.context.d2.i18n.getTranslation('edit_denominator')} onClick={this.setDenominator} />
                    <Dialog
                        open={this.state.dialogOpen}
                        modal
                        actions={dialogActions}
                        contentStyle={{ maxWidth: '90%' }}
                        bodyStyle={{ padding: '0' }}
                        autoScrollBodyContent
                    >
                        {this.state ? this.renderExpressionManager() : null}
                    </Dialog>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <DataIndicatorGroupsAssignment source={this.props.modelToEdit} />
                </div>
            </div>
        );
    }

    setNumerator() {
        this.setState({ type: 'numerator', dialogOpen: true, });
    }

    setDenominator() {
        this.setState({ type: 'denominator', dialogOpen: true, });
    }

    closeDialog() {
        this.setState({ dialogOpen: false });
    }

    saveToModelAndCloseDialog() {
        if (this.state.expressionStatus.isValid) {
            this.props.modelToEdit[this.state.type] = this.state.expressionFormula;
            this.props.modelToEdit[`${this.state.type}Description`] = this.state.expressionDescription;

            modelToEditStore.setState(this.props.modelToEdit);
        }

        this.setState({ dialogOpen: false });
    }

    indicatorExpressionChanged(data) {
        const expressionValues = {};

        if (data.expressionStatus.isValid) {
            expressionValues.expressionStatus = data.expressionStatus;
            expressionValues.expressionDescription = data.description;
            expressionValues.expressionFormula = data.formula;
        }

        this.setState({
            dialogValid: data.expressionStatus.isValid && Boolean(data.description.trim()),
            ...expressionValues,
        });
    }
}
IndicatorExtraFields.propTypes = {
    modelToEdit: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    formula: React.PropTypes.string.isRequired,
};

export default {
    dataElement: [
        {
            name: 'dataElementGroupAssignment',
            component: (props) => {
                return (
                    <div style={{ marginTop: '2rem' }}>
                        <DataElementGroupsAssignment source={props.modelToEdit} />
                    </div>
                );
            },
        }
    ],
    indicator: [
        {
            name: 'indicatorGroupAssignmentAndGroupAssignments',
            component: addD2Context(IndicatorExtraFields),
        }
    ]
};
