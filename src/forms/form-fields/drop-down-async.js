import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getInstance } from 'd2/lib/d2';

import DropDown from './drop-down';
import QuickAddLink from './helpers/QuickAddLink.component';
import RefreshMask from './helpers/RefreshMask.component';

const wrapStyles = {
    display: 'flex',
    alignItems: 'flex-end',
};

class DropDownAsync extends Component {
    state = {
        options: [],
        isRefreshing: false,
    }

    componentDidMount() {
        this.loadOptions();
    }

    // TODO: Remove this hack to update the categoryCombo property when the domainType is set to TRACKER
    // This should probably be done in the objectActions, however there we currently do not have any knowledge of the
    // options.. It might be worth loading the categoryOption with name `default` just for this.
    componentWillReceiveProps(newProps) {
        const defaultOption = this.state.options.find(option => option.model.name === 'default');

        if (newProps.value && defaultOption && defaultOption.model.id !== newProps.value.id &&
            this.props.model && this.props.model.domainType === 'TRACKER') {
            this.props.onChange({
                target: {
                    value: defaultOption.model,
                },
            });
        }
    }

    componentWillUnmount() {
        this.omgLikeJustStop = true;
    }

    onRefreshClick = () => {
        this.setState({
            isRefreshing: true,
        });

        this.loadOptions()
            .then(() => this.setState({ isRefreshing: false }));
    }

    onChange = (event) => {
        if (event.target.value === null) {
            this.props.onChange({
                target: {
                    value: null,
                },
            });
            return;
        }

        const option = this.state.options.find(opt => opt.model.id === event.target.value);
        if (option && option.model) {
            this.props.onChange({
                target: {
                    value: option.model,
                },
            });
        }
    }

    loadOptions() {
        let fieldsForReferenceType = 'id,displayName,name';

        // The valueType is required for optionSet so we can set the model valueType to the optionSet.valueType
        if (this.props.referenceType === 'optionSet') {
            fieldsForReferenceType = 'id,displayName,name,valueType';
        }

        // program.programType is required for programIndicators to be able to determine if it is a tracker or event program
        if (this.props.referenceType === 'program') {
            /*
             * DHIS-2444: program.programTrackedEntity is needed for the
             * attributeselector to work when changing programs.
             */

            fieldsForReferenceType = 'id,displayName,programType,programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]';
        }
        //Need trackedEntityAttribute-ids for trackerProgram to assign programTrackedEntityAttributes
        if(this.props.referenceType === 'trackedEntityType') {
            fieldsForReferenceType = fieldsForReferenceType.concat(',trackedEntityTypeAttributes[trackedEntityAttribute]');
        }

        const filter = this.props.queryParamFilter;
        let d2i = {};

        return getInstance()
            .then((d2) => {
                d2i = d2;
                if (d2.models.hasOwnProperty(this.props.referenceType)) {
                    return d2.models[this.props.referenceType].list(Object.assign(
                        {
                            fields: fieldsForReferenceType,
                            paging: false,
                            filter,
                        },
                        filter && filter.length > 1
                            ? { rootJunction: 'OR' }
                            : {},
                    ));
                } else if (this.props.referenceType.indexOf('.') !== -1) {
                    const modelName = this.props.referenceType.substr(0, this.props.referenceType.indexOf('.'));
                    const modelProp = this.props.referenceType.substr(modelName.length + 1);
                    return d2.models[modelName].modelProperties[modelProp].constants
                        .map(v => ({ displayName: d2.i18n.getTranslation(v.toLowerCase()), id: v }));
                }
            })
            .then(modelCollection => (
                modelCollection
                    ? (modelCollection.toArray ? modelCollection.toArray() : modelCollection)
                    : []
            ))
            .then(values => values.map(model => ({
                text: model.displayName,
                value: model.id,
                model,
            })))
            .then((options) => {
                // Behold the mother of all hacks
                if (!this.omgLikeJustStop) {
                    this.setState({
                        // Behold the very special hack for renaming the very special 'default' cat combo to 'None'
                        options: options.map(option => Object.assign(
                            option,
                            option.model &&
                            option.model.modelDefinition &&
                            option.model.modelDefinition.name === 'categoryCombo' &&
                            option.text === 'default'
                                ? { text: d2i.i18n.getTranslation('none') }
                                : {},
                        )),
                    });
                }
            })
    }

    render() {
        const {
            errorStyle,
            errorText,
            modelDefinition,
            models,
            referenceType,
            referenceProperty,
            isInteger,
            multiLine,
            fullWidth,
            translateOptions,
            options,
            model,
            queryParamFilter,
            quickAddLink,
            preventAutoDefault,
            style,
            ...other
        } = this.props;

        /* Because of bad alignment of material ui textfield and selectfield, the compoents becomes skewed when
            using the hide method EditModelForm.component (setting the display to none/block). The component 
            must instead chose to either use display:none from style or its defined display:flex. 
        */
        if (style && style.display && style.display === 'none') {
            return null;
        }

        return (
            <div style={wrapStyles}>
                    {this.state.isRefreshing && <RefreshMask horizontal />}
                    <DropDown
                        {...other}
                        top={this.props.top}
                        options={this.state.options}
                        value={this.props.value ? this.props.value.id : this.props.value}
                        onChange={this.onChange}
                        fullWidth={fullWidth}
                    />
                    {quickAddLink &&
                        <QuickAddLink
                            referenceType={this.props.referenceType}
                            onRefreshClick={this.onRefreshClick}
                        />
                    }
            </div>
        );
    }
}

DropDownAsync.propTypes = {
    value: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    referenceType: PropTypes.string.isRequired,
    queryParamFilter: PropTypes.array,
    errorText: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    translateOptions: PropTypes.bool,
    preventAutoDefault: PropTypes.bool,
    isInteger: PropTypes.bool,
    quickAddLink: PropTypes.bool,
    multiLine: PropTypes.bool,
    fullWidth: PropTypes.bool,
    style: PropTypes.object,
    errorStyle: PropTypes.object,
    referenceProperty: PropTypes.string,
    modelDefinition: PropTypes.object,
    models: PropTypes.object,
    model: PropTypes.object,
    options: PropTypes.array,
};

DropDownAsync.defaultProps = {
    queryParamFilter: undefined,
    value: undefined,
    translateOptions: false,
    fullWidth: true,
    multiLine: false,
    isInteger: false,
    quickAddLink: true,
    preventAutoDefault: false,
    errorText: '',
    style: {},
    referenceProperty: '',
    errorStyle: {},
    modelDefinition: {},
    models: {},
    model: {},
    options: [],
};

export default DropDownAsync;

