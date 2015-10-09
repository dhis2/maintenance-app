import React from 'react';
import log from 'loglevel';
import ObservedEvents from '../utils/ObservedEvents.mixin';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';

const SideBar = React.createClass({
    propTypes: {
        filterChildren: React.PropTypes.func,
        items: React.PropTypes.array.isRequired,
        title: React.PropTypes.string.isRequired,
        searchHint: React.PropTypes.string.isRequired,
    },

    mixins: [ObservedEvents],

    getDefaultProps() {
        return {
            items: [],
        };
    },

    getInitialState() {
        return {
            searchString: '',
        };
    },

    componentDidMount() {
        this.events.search
            .throttle(200)
            .do(event => {
                if (event.which === 13) {
                    this.selectTheFirst();
                }
            })
            .distinctUntilChanged()
            .map(event => event && event.target && event.target.value ? event.target.value : '')
            .subscribe(
                searchString => {
                    console.log(searchString);
                    this.setState({
                        searchString: searchString,
                    });
                },
                error => {
                    log.error('Could not set the search string', error);
                }
            );
    },

    render() {
        this.filteredChildren = this.props.items
            .map((item, index) => {
                if (this.state.searchString && this.props.filterChildren) {
                    // Do not render children that do not comply with the filter
                    if (!this.props.filterChildren(this.state.searchString, item.primaryText)) {
                        return null;
                    }
                }
                return (<ListItem key={`${item.primaryText}-${index}`} {...item} />);
            });

        return (
            <div className="sidebar">
                <h3>{this.props.title}</h3>
                <TextField hintText={this.props.searchHint}
                           type="search"
                           style={{width: '100%'}}
                           onKeyUp={this.createEventObserver('search')} />
                <List style={{backgroundColor: 'inherit'}}>
                    {this.filteredChildren}
                </List>
            </div>
        );
    },

    selectTheFirst() {
        // TODO: This ties into the DOM, which is not really best practice. Think about a way to solve this without having to do other hacky magic.
        React.findDOMNode(this).querySelector('a').click();
    },
});

export default SideBar;
