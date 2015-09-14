import React from 'react';
import log from 'loglevel';
import ObservedEvents from '../utils/ObservedEvents.mixin';

const SideBar = React.createClass({
    mixins: [ObservedEvents],

    propTypes: {
        filterChildren: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            items: []
        };
    },

    getInitialState() {
        return {
            searchString: ''
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
                        searchString: searchString
                    });
                },
                error => {
                    log.error('Could not set the search string');
                }
            );
    },

    selectTheFirst() {
        //TODO: This ties into the DOM, which is not really best practice. Think about a way to solve this without having to do other hacky magic.
        React.findDOMNode(this).querySelector('a').click();
    },

    render() {
        this.filteredChildren = React.Children.map(this.props.children, child => {
            if (this.state.searchString && this.props.filterChildren) {
                //Do not render children that do not comply with the filter
                if (!this.props.filterChildren(this.state.searchString, child)) {
                    return null;
                }
            }
            return (<li>{React.cloneElement(child, {key: child.props.params.modelType})}</li>);
        });

        return (
            <div className="sidebar">
                <h3>{this.props.title}</h3>
                <input placeholder="Filter menu items by name (Hit enter to go to first)" type="search" className="search-sidebar-items" onKeyUp={this.createEventObserver('search')} />
                <ul>
                    {this.filteredChildren}
                </ul>
            </div>
        );
    }
});

export default SideBar;
