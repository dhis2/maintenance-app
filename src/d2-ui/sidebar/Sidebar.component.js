import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    container: {
        padding: '16px 32px 0 24px',
        position: 'relative',
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        cursor: 'pointer',
        top: '2rem',
        right: '.75rem',
        fontSize: '1rem',
        color: '#AAA',
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
        marginTop: 16,
    },
    item: {
        fontSize: 14,
        borderRadius: 5,
        margin: '0 8px',
    },
    activeItem: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2196f3',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        margin: '0 8px',
    },
    sidebar: {
        backgroundColor: '#f3f3f3',
        overflowY: 'auto',
        width: 295,
    },
};

class Sidebar extends Component {
    state = {
        currentSection: this.props.currentSection || (this.props.sections[0] && this.props.sections[0].key),
        searchText: '',
    };

    componentWillReceiveProps(props) {
        if (props.currentSection) {
            this.setState({ currentSection: props.currentSection });
        }

        if (props.searchText && props.searchText !== this.state.searchText) {
            this.setState({ searchText: props.searchText }, () => {
                this.changeSearchText();
            });
        }
    }

    setSection(key) {
        // TODO: Refactor as this behavior is sort of silly. The current version of the SideBar with managed state should
        // probably be a HoC and a simpler version of the header bar should be available for more dynamic scenarios.
        this.props.onSectionClick(key);

        if (key !== this.state.currentSection) {
            this.setState({ currentSection: key });
            this.props.onChangeSection(key);
        }
    }

    changeSearchText = () => {
        this.setState({ searchText: this.searchBox.getValue() }, () => {
            if (this.props.onChangeSearchText) {
                this.props.onChangeSearchText(this.state.searchText);
            }
        });
    }

    onClear = () => {
        this.setState({ searchText: '' }, () => {
            if (this.props.onChangeSearchText) {
                this.props.onChangeSearchText(this.state.searchText);
            }
        });
    }

    clearSearchBox() {
        this.setState({ searchText: '' });
    }

    renderSidebarButtons() {
        if (this.props.sideBarButtons) {
            return (
                <div style={{ padding: '1rem 0 0' }}>{this.props.sideBarButtons}</div>
            );
        }
        return null;
    }

    renderSearchField() {
        const d2 = this.context.d2;

        if (this.props.showSearchField) {
            return (
                <div style={styles.container}>
                    <TextField
                        hintText={this.props.searchFieldLabel ? this.props.searchFieldLabel : d2.i18n.getTranslation('search')}
                        style={{ width: '100%' }}
                        value={this.state.searchText}
                        onChange={this.changeSearchText}
                        ref={(ref) => { this.searchBox = ref; }}
                    />
                    {this.state.searchText ? <FontIcon style={styles.closeButton} className="material-icons" onClick={this.onClear}>clear</FontIcon> : undefined}
                </div>
            );
        }

        return null;
    }

    renderSections() {
        return (
            <List style={styles.list}>
                {this.props.sections.map((section) => {
                    const listItemStyle = section.key === this.state.currentSection && !this.state.searchText
                        ? styles.activeItem
                        : styles.item;
                    const icon = typeof section.icon === 'string' || section.icon instanceof String
                        ? <FontIcon className="material-icons">{section.icon}</FontIcon>
                        : section.icon;

                    return (<ListItem
                        key={section.key}
                        primaryText={section.label}
                        onClick={this.setSection.bind(this, section.key)}
                        style={listItemStyle}
                        leftIcon={icon}
                        containerElement={section.containerElement}
                    />);
                })}
            </List>
        );
    }

    render() {
        return (
            <div style={Object.assign({}, styles.sidebar, this.props.styles.leftBar)} className="left-bar">
                {this.renderSidebarButtons()}
                {this.renderSearchField()}
                {this.renderSections()}
            </div>
        );
    }
}

Sidebar.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string,
        containerElement: PropTypes.object,
        icon: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
    })).isRequired,
    currentSection: PropTypes.string,
    onChangeSection: PropTypes.func,
    onSectionClick: PropTypes.func,
    showSearchField: PropTypes.bool,
    searchFieldLabel: PropTypes.string,
    onChangeSearchText: PropTypes.func,
    sideBarButtons: PropTypes.element,
    styles: PropTypes.shape({
        leftBar: PropTypes.object,
    }),
};

Sidebar.contextTypes = {
    d2: PropTypes.object,
    muiTheme: PropTypes.object,
};

Sidebar.defaultProps = {
    showSearchField: false,
    styles: {
        leftBar: {},
    },
    onSectionClick: () => {},
};

export default Sidebar;
