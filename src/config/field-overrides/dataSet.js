import React from 'react';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import DataSetElementField from './data-set/DataSetElementField.component';
import DataInputPeriods from './data-set/DataInputPeriods.component';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import Checkbox from '../../forms/form-fields/check-box';
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import log from "loglevel";

class RenderAsTabsSettings extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            displayOptions: this.parseDisplayOptions()
        };
        this.translate = context.d2.i18n.getTranslation.bind(
            context.d2.i18n
        );
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
        this.setState({displayOptions: newDisplayOptions});
        this.props.model.displayOptions = JSON.stringify(newDisplayOptions)
    }

    onDisplayOptionsChanged = (event) =>  {
        const tabsDirection = event.target.value
        this.updateTabsDirection(tabsDirection)
    }

    onRenderAsTabsChanged = (event) =>  {
        const renderAsTabs = event.target.value
        const tabsDirection =
            renderAsTabs
                ? 'horizontal'
                : undefined

        this.props.onChange({ target: { value: renderAsTabs } });
        this.updateTabsDirection(tabsDirection)
    }


    render() {
        const state = this.state;
        const props = this.props;
        return <div>
           <Checkbox
            labelText={this.translate('render_as_tabs')}
            value={props.value}
            onChange={this.onRenderAsTabsChanged}
        />
            {props.value &&
             <RadioButtonGroup
                onChange={this.onDisplayOptionsChanged}
                name="tabsDirection"
                defaultSelected={
                    (state.displayOptions && state.displayOptions.tabsDirection) || 'horizontal'  }
            >
                <RadioButton
                    key='horizontal'
                    value='horizontal'
                    label={this.translate('horizontal')}
                    style={{margin: '10px'}}
                />
                <RadioButton
                    key='vertical'
                    value='vertical'
                    label={this.translate('vertical')}
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
        component: addD2Context(RenderAsTabsSettings),
    }]
]);

