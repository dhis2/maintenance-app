import React from 'react';
import ObservedEvents from '../utils/ObservedEvents.mixin';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import TextField from 'material-ui/lib/text-field';
import { config } from 'd2/lib/d2';
import { currentSubSection$ } from '../App/appStateStore';

config.i18n.strings.add('search_by_name');

const SearchBox = React.createClass({
    propTypes: {
        searchObserverHandler: React.PropTypes.func.isRequired,
    },

    mixins: [ObservedEvents, Translate],

    getInitialState() {
        return {
            value: ''
        };
    },

    componentWillMount() {
        this.searchBoxCb = this.createEventObserver('searchBox');
    },

    componentDidMount() {
        const searchObserver = this.events.searchBox
            .debounce(400)
            .map(event => event && event.target && event.target.value ? event.target.value : '')
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);

        this.disposable = currentSubSection$
            .subscribe((appState) => this.setState({ value: '' }));
    },

    componentWillUnmount() {
        this.disposable && this.disposable.dispose && this.disposable.dispose();
    },

    render() {
        return (
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
        );
    },

    _onKeyUp(event) {
        this.setState({
            value: event.target.value,
        });
        this.searchBoxCb(event);
    }
});

export default SearchBox;
