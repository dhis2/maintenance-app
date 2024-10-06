import React from "react";
import log from "loglevel";
import Checkbox from "../../../forms/form-fields/check-box";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";

class RenderAsTabs extends React.Component {
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

    updateDisplayOptions = (newDisplayOptions) => {
        this.setState({displayOptions: newDisplayOptions});
        this.props.model.displayOptions = JSON.stringify(newDisplayOptions)
    }

    onCollapsibleSectionsChanged = (event) =>  {
        const newDisplayOptions = {
            ...this.state.displayOptions,
            collapsibleSections: event.target.value
        }
        this.updateDisplayOptions(newDisplayOptions)
    }

    onTabDirectionChanged = (event) =>  {
        const newDisplayOptions = {
            ...this.state.displayOptions,
            tabsDirection: event.target.value
        }
        this.updateDisplayOptions(newDisplayOptions)
    }

    onRenderAsTabsChanged = (event) =>  {
        const renderAsTabs = event.target.value
        this.props.onChange({ target: { value: renderAsTabs } });
        const newDisplayOptions = {
            ...this.state.displayOptions,
            tabsDirection: renderAsTabs ? 'horizontal' : undefined
        }
        this.updateDisplayOptions(newDisplayOptions)
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
                    onChange={this.onTabDirectionChanged}
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
            <Checkbox
                labelText={this.translate('make_sections_collapsible')}
                value={ (state.displayOptions && state.displayOptions.collapsibleSections) || false  }
                onChange={this.onCollapsibleSectionsChanged}
            />
        </div>

    }
}

export default RenderAsTabs;
