import React from 'react';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import DataSetElementField from './data-set/DataSetElementField.component';
import DataInputPeriods from './data-set/DataInputPeriods.component';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import Checkbox from '../../forms/form-fields/check-box';
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import log from "loglevel";

class RenderAsTabsSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderAsTabs: props.value,
            displayOptions: this.parseDisplayOptions()
        };
    }

    parseDisplayOptions = () =>  {
        try {
            return this.props
                && this.props.model['displayOptions']
                && JSON.parse(this.props.model['displayOptions'])
        } catch (e) {
            log.error(e);
            return undefined
        }
    }

    updateTabsDirection = (tabsDirection) => {
        const newDisplayOptions = {
            ...this.state.displayOptions,
            tabsDirection
        }
        this.setState((prevState, _) => ({
            ...prevState,
            displayOptions: newDisplayOptions
        }));
        this.props.model.displayOptions = JSON.stringify(newDisplayOptions)
    }

    onDisplayOptionsChanged = (event) =>  {
        const tabsDirection = event.target.value
        this.updateTabsDirection(tabsDirection)
    }

    onDisplayAsTabsChanged = (event) =>  {
        const renderAsTabs = event.target.value
        const tabsDirection =
            renderAsTabs
                ? 'horizontal'
                : undefined

        this.setState((prevState) => ({
            ...prevState,
            renderAsTabs
        }));
        this.props.onChange({ target: { value: renderAsTabs } });
        this.updateTabsDirection(tabsDirection)
    }


    render() {
        const state = this.state;
        return <div>
           <Checkbox
            labelText="Render as tabs"
            value={state.renderAsTabs}
            onChange={this.onDisplayAsTabsChanged}
        />
            {state.renderAsTabs &&
             <RadioButtonGroup
                onChange={this.onDisplayOptionsChanged}
                name="tabsDirection"
                defaultSelected={
                    (state.displayOptions && state.displayOptions.tabsDirection) || 'horizontal'  }
            >
                <RadioButton
                    key='horizontal'
                    value='horizontal'
                    label='Horizontal'
                    style={{margin: '10px'}}
                />
                <RadioButton
                    key='vertical'
                    value='vertical'
                    label='Vertical'
                    style={{margin: '10px'}}
                />
            </RadioButtonGroup>}
        </div>
    }
}

export default new Map([
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
            defaultToDefaultValue: true,
        },
    }],
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
    ['dataSetElements', {
        component: DataSetElementField,
    }],
    ['dataInputPeriods', {
        component: DataInputPeriods,
    }],
    ['renderAsTabs', {
        component: RenderAsTabsSettings,
    }]
]);

