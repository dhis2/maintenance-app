import React from 'react';
import log from 'loglevel';
import ObservedEvents from '../utils/ObservedEvents.mixin';
import List from 'material-ui/lib/lists/list';
import TextField from 'material-ui/lib/text-field';
import SideBarItem from './SideBarItem.component';
import FontIcon from 'material-ui/lib/font-icon';
import Paper from 'material-ui/lib/paper';

const SideBar = React.createClass({
    propTypes: {
        filterChildren: React.PropTypes.func,
        items: React.PropTypes.array.isRequired,
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
                    this.setState({searchString: searchString});
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
                return (<SideBarItem key={`${item.primaryText}-${index}`} {...item} />);
            });

        return (
            <Paper className="sidebar">
                <div style={{padding: '1rem 1rem 0', position: 'relative'}}>
                    <TextField hintText={this.props.searchHint} style={{width: '100%'}}
                               onKeyUp={this.createEventObserver('search')}
                               ref="searchBox"
                    />
                    {this.state && this.state.showCloseButton ? <FontIcon style={closeButtonStyle} className="material-icons" onClick={this.clearSearchBox}>clear</FontIcon> : null}
                </div>
                <List style={{backgroundColor: 'inherit'}}>
                    {this.filteredChildren}
                </List>
            </Paper>
        );
    },

    selectTheFirst() {
        // TODO: This ties into the DOM, which is not really best practice. Think about a way to solve this without having to do other hacky magic.
        const firstItem = React.findDOMNode(this).querySelector('a');

        if (firstItem) {
            firstItem.click();
        }
    },
});

export default SideBar;
