import React from 'react';
import Action from 'd2-flux/action/Action';
import FormUpdateContext from 'd2-ui-basicfields/FormUpdateContext.mixin';
import IndicatorExpressionManager from 'd2-ui/lib/indicator-expression-manager/IndicatorExpressionManager.component';
import indicatorExpressionStatusStore from 'd2-ui/lib/indicator-expression-manager/indicatorExpressionStatus.store';
import dataElementOperandSelectorActions from 'd2-ui/lib/indicator-expression-manager/dataElementOperandSelector.actions';
import {getInstance as getD2} from 'd2';
import {Observable} from 'rx';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

const indicatorExpressionStatusActions = Action.createActionsFromNames(['requestExpressionStatus']);
indicatorExpressionStatusActions.requestExpressionStatus
    .throttle(500)
    .map(action => {
        const encodedFormula = encodeURIComponent(action.data);
        const url = `expressions/description?expression=${encodedFormula}`;
        const request = getD2()
            .then(d2 => {
                return d2.Api.getApi().get(url);
            });

        return Observable.fromPromise(request);
    })
    .concatAll()
    .subscribe(response => {
        indicatorExpressionStatusStore.setState(response);
    });

const IndicatorExpressionManagerContainer = React.createClass({
    propTypes: {
        indicatorExpressionChanged: React.PropTypes.func.isRequired,
        description: React.PropTypes.string.isRequired,
        formula: React.PropTypes.string.isRequired,
    },

    mixins: [FormUpdateContext, Translate],

    render() {
        return (
            <IndicatorExpressionManager
                descriptionLabel={this.getTranslation('description')}
                descriptionValue={this.props.description}
                formulaValue={this.props.formula}
                organisationUnitGroupOptions={[]}
                constantOptions={[]}
                expressionStatusActions={indicatorExpressionStatusActions}
                expressionStatusStore={indicatorExpressionStatusStore}
                dataElementOperandSelectorActions={dataElementOperandSelectorActions}
                indicatorExpressionChanged={this.props.indicatorExpressionChanged}
                />
        );
    },
});

export default IndicatorExpressionManagerContainer;
