import React from 'react';
import DropDown from '../../forms/form-fields/drop-down';

import IndicatorExpressionManager from 'd2-ui/lib/indicator-expression-manager/IndicatorExpressionManager.component';
import dataElementOperandSelectorActions from 'd2-ui/lib/indicator-expression-manager/dataElementOperandSelector.actions';
import Store from 'd2-ui/lib/store/Store';

const expressionStatusStore = Store.create();

export default new Map([
    ['periodType', {
        component: DropDown,
        fieldOptions: {
            options: [
                'Daily', 'Weekly', 'Monthly', 'BiMonthly', 'Quarterly', 'SixMonthlyApril', 'Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOctober',
            ],
        },
    }],
    ['leftSide', {
        component: () => <IndicatorExpressionManager
            descriptionLabel={'description'}
            descriptionValue={''}
            formulaValue={''}
            organisationUnitGroupOptions={[]}
            constantOptions={[]}
            expressionStatusActions={{}}
            expressionStatusStore={expressionStatusStore}
            dataElementOperandSelectorActions={dataElementOperandSelectorActions}
            indicatorExpressionChanged={(...args) => console.log(args)}
            titleText={'Meh!'}
            ref="expressionManager"
        />,
    }],
    ['rightSide', {
        component: () => <div>Right side</div>,
    }],
]);
