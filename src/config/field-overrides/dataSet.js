import React from 'react';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import DataSetElementField from './data-set/DataSetElementField.component';
import DataInputPeriods from './data-set/DataInputPeriods.component';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import Checkbox from '../../forms/form-fields/check-box';
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import log from "loglevel";
import TextField from "material-ui/TextField/TextField";

class RenderAsTabsSettings extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            displayOptions: this.parseDisplayOptions(),
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

    updateDisplayOption = (newDisplayOptions) => {
        this.setState({displayOptions: newDisplayOptions});
        this.props.model.displayOptions = JSON.stringify(newDisplayOptions)
    }

    onDisplayOptionsChanged = (event) =>  {
        const tabsDirection = event.target.value
        const newDisplayOptions = {
            ...this.state.displayOptions,
            tabsDirection
        }
        this.updateDisplayOption(newDisplayOptions)
    }


    onRenderAsTabsChanged = (event) =>  {
        const renderAsTabs = event.target.value
        const tabsDirection =
            renderAsTabs
                ? 'horizontal'
                : undefined

        this.props.onChange({ target: { value: renderAsTabs } });
        const newDisplayOptions = {
            ...this.state.displayOptions,
            tabsDirection
        }
        this.updateDisplayOption(newDisplayOptions)
    }

    onAddCustomTextChanged = (event) =>  {
        const addCustomText = event.target.value
        const customText =
            addCustomText
                ? {header: undefined, subheader: undefined, align: 'center'}
                : undefined

        const newDisplayOptions = {
            ...this.state.displayOptions,
            customText
        }
        this.updateDisplayOption(newDisplayOptions)
    }

    onCustomTextChanged = (event, field) =>  {
        const customText =
            {...this.state.displayOptions.customText,  [field]: event.target.value}

        const newDisplayOptions = {
            ...this.state.displayOptions,
            customText
        }
        this.updateDisplayOption(newDisplayOptions)
    }

    onCustomTextAlignmentChanged = (event) =>  {
        this.onCustomTextChanged(event, 'align')
    }


    onCustomTextHeaderChanged = (event) =>  {
        this.onCustomTextChanged(event, 'header')
    }

    onCustomTextSubheaderChanged = (event) =>  {
        this.onCustomTextChanged(event, 'subheader')
    }

    render() {
        const state = this.state;
        const props = this.props;
        const customTextCssStyles = {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '16px'
        };
        return <div>
            <div>
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
                            (state.displayOptions && state.displayOptions.tabsDirection) || 'horizontal'}
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
            <div>
            <Checkbox
                labelText={this.translate('add_custom_text')}
                value={state.displayOptions && state.displayOptions.customText !== undefined}
                onChange={this.onAddCustomTextChanged}
            />

            {state.displayOptions && state.displayOptions.customText &&
                <RadioButtonGroup
                    onChange={this.onCustomTextAlignmentChanged}
                    name="customTextAlignment"
                    defaultSelected={
                        (state.displayOptions && state.displayOptions.customText && state.displayOptions.customText.align) || 'center'}
                >
                    <RadioButton
                        key='line-start'
                        value='line-start'
                        label={this.translate('line_start')}
                        style={{margin: '10px'}}
                    />
                    <RadioButton
                        key='center'
                        value='center'
                        label={this.translate('center')}
                        style={{margin: '10px'}}
                    />
                    <RadioButton
                        key='line-end'
                        value='line-end'
                        label={this.translate('line_end')}
                        style={{margin: '10px'}}
                    />
                </RadioButtonGroup>}

                {state.displayOptions && state.displayOptions.customText &&
                <div style={customTextCssStyles}>
                    <TextField
                        value={(state.displayOptions && state.displayOptions.customText &&
                            state.displayOptions.customText.header) || ""}
                        fullWidth={false}
                        onChange={this.onCustomTextHeaderChanged}
                        floatingLabelText={this.translate('data_set_title')}
                        maxLength={500}
                    />
                    <TextField
                        value={(state.displayOptions && state.displayOptions.customText &&
                            state.displayOptions.customText.subheader) || ""}
                        fullWidth={false}
                        onChange={this.onCustomTextSubheaderChanged}
                        floatingLabelText={this.translate('data_set_subtitle')}
                        maxLength={500}
                    />
                </div>}
            </div>
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

