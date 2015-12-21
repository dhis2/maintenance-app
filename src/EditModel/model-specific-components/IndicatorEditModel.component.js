import React from 'react';
import EditModel from '../EditModel.component';
import {getInstance as getD2} from 'd2/lib/d2';
import Pager from 'd2/lib/pager/Pager';
import Dialog from 'material-ui/lib/dialog';
import FormUpdateContext from '../../BasicFields/FormUpdateContext.mixin';
import RaisedButton from 'material-ui/lib/raised-button';

// Indicator expression manager
import IndicatorExpressionManagerContainer from './IndicatorExpressionManagerContainer.component';
import dataElementOperandStore from 'd2-ui/lib/indicator-expression-manager/dataElementOperand.store';
import dataElementOperandSelectorActions from 'd2-ui/lib/indicator-expression-manager/dataElementOperandSelector.actions';
import {Observable} from 'rx';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

const createFakePager = response => {
    // Fake the modelCollection since dataElementOperands do not have a valid uid
    return {
        pager: new Pager(response.pager),
        toArray() {
            return response.dataElementOperands;
        },
    };
};

dataElementOperandSelectorActions.loadList.subscribe(() => {
    getD2()
        .then(d2 => d2.Api.getApi().get('dataElementOperands', {fields: 'id,displayName'}))
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
            .then(d2 => d2.Api.getApi().get('dataElementOperands', {fields: 'id,displayName', filter: [`name:like:${encodeURIComponent(action.data)}`]}))
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
    .forEach((pager) => {
        console.log('Next:', pager);
    });

dataElementOperandSelectorActions.getPreviousPage
    .forEach((pager) => {
        console.log('Previous:', pager);
    });

const ExtraFields = React.createClass({
    propTypes: {
        modelToEdit: React.PropTypes.object.isRequired,
        description: React.PropTypes.string.isRequired,
        formula: React.PropTypes.string.isRequired,
    },

    mixins: [FormUpdateContext, Translate],

    getInitialState() {
        return {
            dialogValid: true,
        };
    },

    render() {
        const dialogActions = [
            <RaisedButton label="Close" onTouchTap={this.closeDialog} disabled={!this.state.dialogValid} />,
        ];

        return (
            <div>
                <RaisedButton label={this.getTranslation('edit_numerator')} onClick={this.setNumerator} />
                <RaisedButton label={this.getTranslation('edit_denominator')} onClick={this.setDenominator} />
                <Dialog ref="dialog" modal={true} actions={dialogActions} title={`Edit ${this.state.type}`} contentStyle={{maxWidth: '90%'}}>
                    {this.state ? <IndicatorExpressionManagerContainer indicatorExpressionChanged={this.indicatorExpressionChanged} formula={this.props.modelToEdit[this.state.type] || ''} description={this.props.modelToEdit[`${this.state.type}Description`] || ''}  /> : null}
                </Dialog>
            </div>
        );
    },

    setNumerator() {
        this.setState({
            type: 'numerator',
        });
        this.refs.dialog.show();
    },

    setDenominator() {
        this.setState({
            type: 'denominator',
        });
        this.refs.dialog.show();
    },

    closeDialog() {
        this.refs.dialog.dismiss();
    },

    indicatorExpressionChanged(data) {
        this.setState({
            dialogValid: data.expressionStatus.isValid && Boolean(data.description.trim()),
        });

        if (data.expressionStatus.isValid) {
            this.context.updateForm('numerator', data.formula, this.props.formula);
            this.context.updateForm('numeratorDescription', data.description, this.props.description);
        }
    },
});

export default class extends EditModel {
    componentWillMount() {
        super.componentWillMount();
    }

    extraFieldsForModelType() {
        return (
            <ExtraFields modelToEdit={this.state.modelToEdit} />
        );
    }
}
