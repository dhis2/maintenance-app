import React from 'react';
import Action from 'd2-ui/lib/action/Action';
import IndicatorExpressionManager from 'd2-ui/lib/indicator-expression-manager/IndicatorExpressionManager.component';
import indicatorExpressionStatusStore from 'd2-ui/lib/indicator-expression-manager/indicatorExpressionStatus.store';
import dataElementOperandSelectorActions from 'd2-ui/lib/indicator-expression-manager/dataElementOperandSelector.actions';
import { getInstance as getD2 } from 'd2/lib/d2';
import { Observable } from 'rx';
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
        titleText: React.PropTypes.string.isRequired,
    },

    mixins: [Translate],

    getInitialState() {
        return {
            organisationUnitGroups: [],
            constants: [],
            programTrackedEntityAttributes: [],
            programIndicators: [],
            programDataElements: [],
        };
    },

    componentDidMount() {
        getD2()
            .then(d2 => d2.models.organisationUnitGroup.list({ paging: false, fields: 'id,displayName' }))
            .then(collection => collection.toArray().map(model => ({ value: model.id, label: model.displayName })))
            .then(organisationUnitGroups => this.setState({ organisationUnitGroups }));

        getD2()
            .then(d2 => d2.models.constant.list({ paging: false, fields: 'id,displayName' }))
            .then(collection => collection.toArray().map(model => ({ value: model.id, label: model.displayName })))
            .then(constants => this.setState({ constants }));

        this.refs.expressionManager.requestExpressionStatus();
    },

    getExpressionManager() {
        return this.refs.expressionManager;
    },

    render() {
        return (
            <IndicatorExpressionManager
                descriptionLabel={this.getTranslation('description')}
                descriptionValue={this.props.description}
                formulaValue={this.props.formula}
                organisationUnitGroupOptions={this.state.organisationUnitGroups}
                constantOptions={this.state.constants}
                expressionStatusActions={indicatorExpressionStatusActions}
                expressionStatusStore={indicatorExpressionStatusStore}
                dataElementOperandSelectorActions={dataElementOperandSelectorActions}
                indicatorExpressionChanged={this.props.indicatorExpressionChanged}
                titleText={this.props.titleText}
                ref="expressionManager"
                />
        );
    },
});

export default IndicatorExpressionManagerContainer;
