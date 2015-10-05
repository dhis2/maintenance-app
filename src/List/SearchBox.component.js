import React from 'react';
import ObservedEvents from '../utils/ObservedEvents.mixin';
import Translate from 'd2-ui/i18n/Translate.mixin';
import TextField from 'material-ui/lib/text-field';
import {config} from 'd2';

config.i18n.strings.add('search_by_name');
config.i18n.strings.add('press_enter_to_search');

const SearchBox = React.createClass({
    propTypes: {
        searchObserverHandler: React.PropTypes.func.isRequired,
    },

    mixins: [ObservedEvents, Translate],

    componentDidMount() {
        const searchObserver = this.events.searchBox
            .debounce(400)
            .map(event => event && event.target && event.target.value ? event.target.value : '')
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);
    },

    render() {
        return (
            <div className="search-list-items">
                <TextField style={{width: '100%'}}
                           type="search"
                           onKeyUp={this.createEventObserver('searchBox')}
                           hintText={`${this.getTranslation('search_by_name')} ${this.getTranslation('press_enter_to_search')}`} />
            </div>
        );
    },
});

export default SearchBox;
