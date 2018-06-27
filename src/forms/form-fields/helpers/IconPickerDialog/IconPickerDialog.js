import React, { Component } from 'react';
import { debounce, endsWith, sortBy } from 'lodash/fp';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Icon from './Icon';
import filterIcons from './filterIcons';

export default class IconPickerDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            iconKey: props.iconKey,
            icons: null,
            iconTypeFilter: 'all',
            textFilter: '',
        };
        this.iconsCache = {
            all: null,
            positive: null,
            negative: null,
            outline: null,
        };

        this.debouncedUpdateTextFilter = debounce(375, this.updateTextFilter);
    }

    fetchIconLibrary = () => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        // TODO: This should be changed to this.context.d2.Api.getApi().get('/icons')
        this.context.d2.Api.getApi().request('GET', `${contextPath}/api/icons`)
            .then((icons) => {
                const sortedIcons = sortBy('key', icons).map((icon) => {
                    // The '_positive', '_negative' and '_outline' suffixes are stripped for the searchKeys
                    // to make sure that search queries for 'negative' only return icons that actually have
                    // 'negative' in the relevant parts of the icon key.
                    icon.searchKey = icon.key.substring(0, icon.key.lastIndexOf('_'));
                    return icon;
                });
                this.iconsCache = {
                    all: sortedIcons,
                    positive: sortedIcons.filter(icon => endsWith('_positive', icon.key)),
                    negative: sortedIcons.filter(icon => endsWith('_negative', icon.key)),
                    outline: sortedIcons.filter(icon => endsWith('_outline', icon.key)),
                };
                this.setState({ icons: sortedIcons });
            });
    }

    handleOpen = () => {
        this.setState({ open: true });

        if (!this.icons) {
            this.fetchIconLibrary();
        }
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleConfirm = () => {
        this.props.updateStyleState({ icon: this.state.iconKey });
        this.handleClose();
    }

    handleIconSelect = (iconKey) => {
        this.setState({ iconKey });
    };

    handleTypeFilterClick = (type) => {
        this.setState({
            iconTypeFilter: type,
            icons: filterIcons(this.iconsCache[type], this.state.textFilter),
        });
    }

    handleTextFilterChange = (event) => {
        this.setState({ textFilter: event.target.value });
        this.debouncedUpdateTextFilter();
    }

    updateTextFilter = () => {
        const icons = this.iconsCache[this.state.iconTypeFilter];
        this.setState({
            icons: filterIcons(icons, this.state.textFilter),
        });
    }

    renderIconButtonImage = (iconKey) => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        return (
            <img
                /*
                    TODO: This path will change and become the following:
                    `${contextPath}/api/icons/${iconKey}/icon.svg`
                */
                src={`${contextPath}/SVGs/${iconKey}.svg`}
                alt={altText}
                className="icon-picker__icon-button-image"
            />
        );
    };

    renderIconButton = () => {
        const { iconKey } = this.state;

        let conditionalProps;
        if (iconKey) {
            conditionalProps = {
                label: this.context.d2.i18n.getTranslation('change_icon'),
                children: this.renderIconButtonImage(iconKey),
            };
        } else {
            conditionalProps = {
                label: this.context.d2.i18n.getTranslation('add_icon'),
            };
        }

        return <RaisedButton onClick={this.handleOpen} {...conditionalProps} />;
    }

    renderActions = () => (
        [
            <RaisedButton
                label={this.context.d2.i18n.getTranslation('select')}
                primary
                onClick={this.handleConfirm}
            />,
            <FlatButton
                label={this.context.d2.i18n.getTranslation('cancel')}
                onClick={this.handleClose}
            />,
        ]
    )

    renderTypeFilter = () => (
        <div className="icon-picker__filter-button-wrap">
            {
                ['all', 'positive', 'negative', 'outline'].map(type => (
                    <FlatButton
                        key={type}
                        label={this.context.d2.i18n.getTranslation(`icons_${type}`)}
                        primary={type === this.state.iconTypeFilter}
                        /* eslint-disable */
                        onClick={() => this.handleTypeFilterClick(type)}
                        /* eslint-enable */
                    />
                ))
            }
        </div>
    )

    renderTextFilter = () => (
        <TextField
            type="search"
            floatingLabelText={this.context.d2.i18n.getTranslation('icon_search')}
            value={this.state.textFilter}
            onChange={this.handleTextFilterChange}
        />
    )

    renderIconLibrary = () => {
        const { icons, iconKey } = this.state;
        if (!icons) {
            return (
                <div className="icon-picker__list-loader">
                    <CircularProgress />
                </div>
            );
        }

        return (
            <div className="icon-picker__icon-list">
                {icons.map(icon => (
                    <Icon
                        icon={icon}
                        key={icon.key}
                        selectedIconKey={iconKey}
                        handleClick={this.handleIconSelect}
                    />
                ))}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderIconButton()}
                <Dialog
                    title={this.context.d2.i18n.getTranslation('select_icon')}
                    actions={this.renderActions()}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    className="icon-picker"
                    contentClassName="icon-picker__content"
                    titleClassName="icon-picker__title"
                    bodyClassName="icon-picker__body"
                    actionsContainerClassName="icon-picker__actions"
                >
                    <div className="icon-picker__filter-bar">
                        {this.renderTypeFilter()}
                        {this.renderTextFilter()}
                    </div>
                    <div className="icon-picker__scroll-box">
                        {this.renderIconLibrary()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

IconPickerDialog.propTypes = {
    iconKey: PropTypes.string.isRequired,
    updateStyleState: PropTypes.func.isRequired,
};

IconPickerDialog.contextTypes = {
    d2: PropTypes.object,
};
