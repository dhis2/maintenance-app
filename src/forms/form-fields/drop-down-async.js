import React from 'react';
import DropDown from './drop-down';
import { getInstance } from 'd2/lib/d2';
import QuickAddLink from './helpers/QuickAddLink.component';
import RefreshMask from './helpers/RefreshMask.component';

export default React.createClass({
    propTypes: {
        referenceType: React.PropTypes.string.isRequired,
        value: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
        }),
        onChange: React.PropTypes.func.isRequired,
        quickAddLink: React.PropTypes.bool,
        preventAutoDefault: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            quickAddLink: true,
            preventAutoDefault: false,
        };
    },

    getInitialState() {
        return {
            options: [],
            isRefreshing: false,
        };
    },

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

        const filter = this.props.queryParamFilter;
        let d2i = {};

        return getInstance()
            .then(d2 => {
                d2i = d2;
                if (d2.models.hasOwnProperty(this.props.referenceType)) {
                    return d2.models[this.props.referenceType].list(Object.assign({
                        fields: fieldsForReferenceType,
                        paging: false,
                        filter,
                    }, filter && filter.length > 1 ? {
                        rootJunction: 'OR',
                    } : {}))
                } else if (this.props.referenceType.indexOf('.') !== -1) {
                    const modelName = this.props.referenceType.substr(0, this.props.referenceType.indexOf('.'));
                    const modelProp = this.props.referenceType.substr(modelName.length + 1);
                    return d2.models[modelName].modelProperties[modelProp].constants
                        .map(v => ({ displayName: d2.i18n.getTranslation(v.toLowerCase()), id: v }));
                }
            })
            .then(modelCollection => modelCollection
                ? (modelCollection.toArray
                    ? modelCollection.toArray()
                    : modelCollection)
                : [])
            .then(values => values.map(model => {
                return {
                    text: model.displayName,
                    value: model.id,
                    model: model,
                };
            }))
            .then(options => {
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
                                : {}
                        )),
                    });
                }
            });
    },

    componentDidMount() {
        this.loadOptions();
    },

    // TODO: Remove this hack to update the categoryCombo property when the domainType is set to TRACKER
    // This should probably be done in the objectActions, however there we currently do not have any knowledge of the
    // options.. It might be worth loading the categoryOption with name `default` just for this.
    componentWillReceiveProps(newProps) {
        const defaultOption = this.state.options.find(option => {
            return option.model.name === 'default';
        });

        if (newProps.value && defaultOption && defaultOption.model.id !== newProps.value.id &&
            this.props.model && this.props.model.domainType === 'TRACKER') {
            this.props.onChange({
                target: {
                    value: defaultOption.model,
                },
            });
        }
    },

    componentWillUnmount() {
        this.omgLikeJustStop = true;
    },

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
            styles,
            ...other,
        } = this.props;
        const wrapStyles = Object.assign({
            display: 'flex',
            alignItems: 'flex-end',
        }, styles);

        return (
            <div style={wrapStyles}>
                {this.state.isRefreshing ? <RefreshMask horizontal={true} /> : null}
                <DropDown
                    {...other}
                    options={this.state.options}
                    errorText={this.props.errorText}
                    value={this.props.value ? this.props.value.id : undefined}
                    onChange={this._onChange}
                    fullWidth
                />
                {quickAddLink ?
                    <QuickAddLink
                        referenceType={this.props.referenceType}
                        onRefreshClick={this._onRefreshClick}
                    />
                : null}
            </div>
        );
    },

    renderQuickAddLink() {
        const sectionForReferenceType = getSectionForType(this.props.referenceType);

        if (!sectionForReferenceType) {
            return null;
        }

        const styles = {
            quickAddWrap: {
                display: 'flex',
            },
        };

        return (
            <div style={styles.quickAddWrap}>
                <Link
                    tooltip="Add some related object"
                    tooltipPosition="top-left"
                    to={`/edit/${sectionForReferenceType}/${this.props.referenceType}/add`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconButton tooltip="Add new" tooltipPosition="top-left">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Link>
                <IconButton tooltip="Refresh values" tooltipPosition="top-left" onClick={this._onRefreshClick}>
                    <RefreshIcon />
                </IconButton>
            </div>
        );
    },

    _onRefreshClick() {
        this.setState({
            isRefreshing: true,
        });

        this.loadOptions()
            .then(() => this.setState({ isRefreshing: false }));
    },

    _onChange(event) {
        if (event.target.value === null) {
            this.props.onChange({
                target: {
                    value: null,
                },
            });
            return;
        }

        const option = this.state.options.find((opt) => opt.model.id === event.target.value);
        if (option && option.model) {
            this.props.onChange({
                target: {
                    value: option.model,
                },
            });
        }
    },
});
