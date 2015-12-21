import React from 'react';
import classes from 'classnames';
import {isFunction} from 'd2-utils';
import FormFieldMixin from './FormField.mixin';
import log from 'loglevel';
import FontIcon from 'material-ui/lib/font-icon';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

const identity = (value) => value;

const MultiSelect = React.createClass({
    propTypes: {
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            data: React.PropTypes.shape({
                source: React.PropTypes.func,
            }),
            fromModelTransformer: React.PropTypes.func,
            toModelTransformer: React.PropTypes.func,
        }).isRequired,
        model: React.PropTypes.object.isRequired,
    },

    mixins: [FormFieldMixin, Translate],

    getInitialState() {
        const fc = this.props.fieldConfig;

        return {
            fromModelTransformer: isFunction(fc.fromModelTransformer) ? fc.fromModelTransformer : identity,
            toModelTransformer: isFunction(fc.toModelTransformer) ? fc.toModelTransformer : identity,
            availableOptions: [],
            selectedOptions: [],
        };
    },

    componentWillMount() {
        const source = this.props.fieldConfig.data.source;

        if (!isFunction(source) && !Array.isArray(source)) {
            log.warn(`Warning: The source for the MultiSelectBox with key '${this.props.fieldConfig.key}' is not a function or an array.`);
        }

        const initMultiSelectValues = values => {
            const valueOnModel = this.props.model[this.props.fieldConfig.key];
            const transformedSelectedPromises = Promise.all((Array.isArray(valueOnModel) ? valueOnModel : []).map(this.state.fromModelTransformer));

            Promise.all([Promise.resolve(values), transformedSelectedPromises])
                .then(([availableValues, selectedValues]) => {
                    this.collection = availableValues;
                    this.selected = selectedValues;
                    this.updateLists(false);
                });
        };

        if (isFunction(source)) {
            source()
                .then((collection) => {
                    // TODO: This is a poor way of identifying if it is a D2.ModelCollection
                    if (collection.toArray) {
                        this.modelDefinition = collection.modelDefinition;
                        this.pager = collection.pager;
                        initMultiSelectValues(collection.toArray());
                    } else {
                        initMultiSelectValues(collection);
                    }
                });
        }

        if (Array.isArray(source)) {
            initMultiSelectValues(source);
        }
    },

    render() {
        const filterRegExp = new RegExp(this.state.selectedSearchString, 'i');
        const classList = classes('multi-select');
        const sortByName = (a, b) => a.name && b.name && a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        const selectedOptionsToRender = (this.state.selectedOptions || [])
            .filter(selectedOption => filterRegExp.test(selectedOption.name))
            .sort(sortByName);

        const buttonStyle = {
            verticalAlign: 'text-bottom',
            lineHeight: '3rem',
        };

        return (
            <div className={classList}>
                <div className="multi-select--available-list">
                    <TextField hintText={this.getTranslation('search_available')} onChange={this._searchAvailable} /><FlatButton linkButton={true} style={{minWidth: 'inherit'}} onClick={this._doSearchAvailable}><FontIcon className="material-icons">search</FontIcon></FlatButton>
                    <select ref="available"
                            className="available"
                            multiple={true}
                            onScroll={this.loadMoreIfAvailable}
                        >
                        {(this.state.availableOptions).map(availableOption => {
                            return (<option key={availableOption.id} value={availableOption.id} onDoubleClick={this.moveItemToSelected(availableOption)}>{availableOption.name}</option>);
                        })}
                    </select>
                    <div className="multi-select__item-count">{this.state.availableOptions.length}</div>
                </div>
                <div className="multi-select--controls">
                    <ul>
                        <li>
                            <FlatButton style={buttonStyle} onClick={this.moveToSelected} mini={true}>
                                <FontIcon className="material-icons">play_arrow</FontIcon>
                            </FlatButton>
                        </li>
                        <li>
                            <FlatButton style={buttonStyle} onClick={this.moveToAvailable} mini={true}>
                                <FontIcon className="material-icons flip-icon">play_arrow</FontIcon>
                            </FlatButton>
                        </li>
                        <li>
                            <FlatButton style={buttonStyle} onClick={this.selectAll} mini={true}>
                                <FontIcon className="material-icons flip-icon">fast_rewind</FontIcon>
                            </FlatButton>
                        </li>
                        <li>
                            <FlatButton style={buttonStyle} onClick={this.selectNone} mini={true}>
                                <FontIcon className="material-icons flip-icon">fast_forward</FontIcon>
                            </FlatButton>
                        </li>
                    </ul>
                </div>
                <div className="multi-select--selected-list">
                    <TextField hintText={this.getTranslation('search_selected')}  onChange={this._searchSelected} />
                    <select ref="selected" className="selected" multiple={true}>
                        {selectedOptionsToRender.map(selectedOption => {
                            return (<option key={selectedOption.id} value={selectedOption.id} onDoubleClick={this.moveItemToAvailable(selectedOption)}>{selectedOption.name}</option>);
                        })}
                    </select>
                    <div className="multi-select__item-count">{selectedOptionsToRender.length} {this.state.selectedSearchString ? ' of ' + this.selected.length : ''}</div>
                </div>
            </div>
        );
    },

    collection: [],
    selected: [],
    isLoadingMore: false,

    updateLists(updateModel = true) {
        this.setState({
            availableOptions: this.collection.filter(availableOption => {
                return this.selected.map(modelOption => modelOption.id).indexOf(availableOption.id) === -1;
            }),

            selectedOptions: this.selected,
        }, () => {
            const shouldLoadMore = Boolean(this.state.availableOptions.length < 20 && this.pager && this.pager.hasNextPage);
            if (shouldLoadMore && !this.isLoadingMore && !this.state.availableSearchString) {
                log.info('Load more items too few');
                this.loadMoreValuesThroughPager();
            }

            if (updateModel) {
                Promise.all(this.selected.map(this.state.toModelTransformer))
                    .then((values) => {
                        this.handleChange({
                            target: {
                                value: values,
                            },
                        });
                    });
            }
        });
    },

    loadMoreIfAvailable() {
        const availableSelectElement = React.findDOMNode(this.refs.available);

        // TODO: This is not covered by unit tests as phantom.js does not seem to render the select as scrollable
        if (availableSelectElement.scrollHeight !== 0 && availableSelectElement.scrollTop + availableSelectElement.offsetHeight + Math.floor(availableSelectElement.scrollHeight * 0.10) <= availableSelectElement.scrollHeight) {
            return;
        }

        if (this.pager && this.pager.hasNextPage() && !this.isLoadingMore) {
            if (!this.isLoadingMore) {
                this.loadMoreValuesThroughPager();
            }
        }
    },

    loadMoreValuesThroughPager() {
        log.info('Loading more async...');
        this.isLoadingMore = true;

        this.pager.getNextPage()
            .then((collection) => {
                this.isLoadingMore = false;
                this.pager = collection.pager;
                this.collection = this.collection.concat(collection.toArray());
                this.updateLists(false);
            })
            .catch(e => {
                log.error('Failed to load more for the multiselect box', e);
            });
    },

    selectAll() {
        if (this.modelDefinition && !this.state.availableSearchString) {
            this.modelDefinition.list({paging: false})
                .then((collection) => {
                    this.pager = collection.pager;
                    this.selected = collection.toArray();
                    this.collection = collection.toArray();

                    this.setState({
                        allLoaded: true,
                    });

                    this.updateLists();
                });
        } else {
            const alreadySelected = new Set(this.selected.map(value => value.id));
            this.selected = this.selected.concat(this.collection.filter(option => !alreadySelected.has(option.id)));
            this.updateLists();
        }
    },

    selectNone() {
        if (this.state.selectedSearchString) {
            const filterRegExp = new RegExp(this.state.selectedSearchString, 'i');
            this.selected = this.selected.filter(selectedOption => !filterRegExp.test(selectedOption.name));
        } else {
            this.selected = [];
        }
        this.updateLists();
    },

    moveToSelected() {
        const valuesToMove = Array.from(this.refs.available.getDOMNode().options)
            .filter(option => option.selected)
            .map(option => option.value);

        this.selected.push.apply(this.selected, this.collection.filter(value => valuesToMove.indexOf(value.id.toString()) >= 0));
        this.updateLists();
    },

    moveToAvailable() {
        const valuesToMove = Array.from(this.refs.selected.getDOMNode().options)
            .filter(option => option.selected)
            .map(option => option.value);

        this.selected = this.selected
            .filter(modelValue => {
                return valuesToMove.indexOf(modelValue.id.toString()) === -1;
            });
        this.updateLists();
    },

    moveItemToSelected(availableOption) {
        return () => {
            this.selected
                .push(availableOption);
            this.updateLists();
        };
    },

    moveItemToAvailable(availableOption) {
        return () => {
            this.selected = this.selected
                .filter(item => {
                    return item.id !== availableOption.id;
                });

            // Make sure we only keep track of each item once
            const itemsInUse = new Set(this.collection.map(item => item.id));
            if (!itemsInUse.has(availableOption.id)) {
                this.collection.push(availableOption);
            }

            this.updateLists();
        };
    },

    _searchAvailable(event) {
        this.setState({
            availableSearchString: event.target.value.trim(),
        }, () => {
            this.resetAvailableList();
        });
    },

    resetAvailableList() {
        if (this.tempCollection && !this.state.availableSearchString) {
            this.collection = this.tempCollection;
            this.updateLists(false);
        }
    },

    _doSearchAvailable() {
        // If there is no search string update the list back to the original
        if (!this.state.availableSearchString) {
            this.resetAvailableList();
            return;
        }

        if (!this.allLoaded && this.modelDefinition) {
            this.modelDefinition
                .filter().on('name').like(this.state.availableSearchString)
                .list({paging: false})
                .then((collection) => {
                    this.tempCollection = this.collection;
                    this.collection = collection.toArray();
                    this.updateLists(false);
                });
        }
    },

    _searchSelected(event) {
        this.setState({
            selectedSearchString: event.target.value.trim(),
        });
    },
});

export default MultiSelect;
