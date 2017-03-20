import React from 'react';
import ObservedEvents from '../utils/ObservedEvents.mixin';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import TextField from 'material-ui/TextField/TextField';
import { config } from 'd2/lib/d2';
import { currentSubSection$ } from '../App/appStateStore';

const unsearchableSections = [
    'organisationUnit',
];

const SearchBox = React.createClass({
    propTypes: {
        searchObserverHandler: React.PropTypes.func.isRequired,
    },

    mixins: [ObservedEvents, Translate],

    getInitialState() {
        return {
            showSearchField: false,
            value: ''
        };
    },

    componentWillMount() {
        this.searchBoxCb = this.createEventObserver('searchBox');
    },

    componentDidMount() {
        const searchObserver = this.events.searchBox
            .debounceTime(400)
            .map(event => event && event.target && event.target.value ? event.target.value : '')
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);

        this.subscription = currentSubSection$
            .subscribe(currentSection => this.setState({
                value: '',
                showSearchField: !unsearchableSections.includes(currentSection),
            }));
    },

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
    },

    render() {
        return this.state.showSearchField ? (
            <div className="search-list-items">
                <TextField
                    className="list-search-field"
                    value={this.state.value}
                    fullWidth
                    type="search"
                    onChange={this._onKeyUp}
                    hintText={`${this.getTranslation('search_by_name')}`}
                />
            </div>
        ) : null;
    },

    _onKeyUp(event) {
        this.setState({
            value: event.target.value,
        });
        this.searchBoxCb(event);
    }
});

export default SearchBox;
