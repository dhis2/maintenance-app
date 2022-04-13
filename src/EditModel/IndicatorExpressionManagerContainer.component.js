import { Observable } from 'rxjs';
import PropTypes from 'prop-types'
import { getInstance as getD2 } from 'd2';
import { Action } from '@dhis2/d2-ui-core';
import IndicatorExpressionManager from './expression/ExpressionManager'
import ReactCreateClass from 'create-react-class'
import Translate from '@dhis2/d2-ui-translation-dialog/Translate.mixin.js';
import indicatorExpressionStatusStore from './ExpressionStatus.store.js';

import { createActionToValidation$ } from '../utils/createActionToValidation$';

const actionToValidation$ = createActionToValidation$(
    'indicators/expression/description'
)

const indicatorExpressionStatusActions = Action.createActionsFromNames(['requestExpressionStatus']);
indicatorExpressionStatusActions.requestExpressionStatus
    .debounceTime(500)
    .map((action) => {
        const encodedFormula = encodeURIComponent(action.data);
        const url = `expressions/description?expression=${encodedFormula}`;
        const request = getD2()
            .then(d2 => d2.Api.getApi().get(url));

        return Observable.fromPromise(request);
    })
    .concatAll()
    .subscribe((response) => {
        indicatorExpressionStatusStore.setState(response);
    });

const IndicatorExpressionManagerContainer = ReactCreateClass({
    propTypes: {
        indicatorExpressionChanged: PropTypes.func.isRequired,
        description: PropTypes.string,
        formula: PropTypes.string,
        titleText: PropTypes.string,
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
                expressionStatusStore={indicatorExpressionStatusStore}
                expressionChanged={this.props.indicatorExpressionChanged}
                titleText={this.props.titleText}
                validateExpression={actionToValidation$}
                ref="expressionManager"
                expressionType='indicator'
            />
        );
    },
});

export default IndicatorExpressionManagerContainer;
