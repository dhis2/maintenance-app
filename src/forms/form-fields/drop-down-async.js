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
    },

    getInitialState() {
        return {
            options: [],
            isRefreshing: false,
        };
    },

    loadOptions() {
        const fieldsForReferenceType = this.props.referenceType === 'optionSet'
            ? 'id,displayName,name,valueType'
            : 'id,displayName,name';
        const filter = this.props.queryParamFilter;

        return getInstance()
            .then(d2 => d2.models[this.props.referenceType].list(Object.assign({
                fields: fieldsForReferenceType,
                paging: false,
                filter,
            }, filter && filter.length > 1 ? {
                rootJunction: 'OR',
            } : {})))
            .then(modelCollection => modelCollection.toArray())
            .then(values => values.map(model => {
                return {
                    text: model.displayName,
                    value: model.id,
                    model: model,
                };
            }))
            .then(options => {
                this.setState({
                    // TODO: Behold the very special hack for renaming the very special 'default' cat combo to 'None'
                    options: options.map(option => Object.assign(
                        option,
                        option.model &&
                        option.model.modelDefinition &&
                        option.model.modelDefinition.name === 'categoryCombo' &&
                        option.text === 'default'
                            ? { text: 'None' }
                            : {}
                    )),
                }, () => {
                    // TODO: Hack to default categoryCombo to 'default'
                    const defaultOption = this.state.options.find(option => {
                        return option.model.name === 'default';
                    });

                    if (!this.props.value && defaultOption) {
                        this.props.onChange({
                            target: {
                                value: defaultOption.model,
                            },
                        });
                    }

                    this.forceUpdate();
                });
            });
    },

    componentDidMount() {
        this.loadOptions();
    },

    // TODO: Remove this hack to update the categoryCombo property when the domainType is set to TRACKER
    // This should probably be done in the objectActions, however there we currently do not have any knowledge of the options
    // It might be worth loading the categoryOption with name `default` just for this.
    componentWillReceiveProps(newProps) {
        const defaultOption = this.state.options.find(option => {
            return option.model.name === 'default';
        });

        if (newProps.value && defaultOption && defaultOption.model.id !== newProps.value.id && this.props.model.domainType === 'TRACKER') {
            this.props.onChange({
                target: {
                    value: defaultOption.model,
                },
            });
        }
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
            ...other,
        } = this.props;
        const styles = {
            wrap: {
                display: 'flex',
                alignItems: 'flex-end',
            },
        };

        return (
            <div style={styles.wrap}>
                {this.state.isRefreshing ? <RefreshMask horizontal={true} /> : null}
                <DropDown
                    {...other}
                    options={this.state.options}
                    value={this.props.value ? this.props.value.id : undefined}
                    onChange={this._onChange}
                    fullWidth
                />
                <QuickAddLink
                    referenceType={this.props.referenceType}
                    onRefreshClick={this._onRefreshClick}
                />
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
