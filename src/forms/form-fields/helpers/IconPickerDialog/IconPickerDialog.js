import React, { Component } from 'react';
import { debounce, endsWith, sortBy } from 'lodash/fp';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Icon from './Icon';
import filterIcons from './filterIcons';
import { IconPickerCustomTab } from './IconPickerCustomTab.js';
import { IconList } from './IconList.js';

export default class IconPickerDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            iconKey: props.iconKey,
            selectedIconKey: props.iconKey,
            icons: null,
            iconTypeFilter: 'all',
            debouncedTextFilter: '',
            // list of icons uploaded by the user, to be able to prepend list with
            // newly uploaded icons
            uploadedIcons: [],
        };
        this.iconsCache = {
            all: null,
            positive: null,
            negative: null,
            outline: null,
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleCancel = () => {
        this.setState({
            selectedIconKey: this.props.iconKey, //if cancelling revert back to original icon
        });
        this.handleClose();
    };

    handleConfirm = () => {
        this.setState({
            iconKey: this.state.selectedIconKey,
        });
        this.props.updateStyleState({
            icon: this.state.selectedIconKey,
        });
        this.handleClose();
    };

    handleIconSelect = iconKey => {
        this.setState({
            selectedIconKey: iconKey,
        });
    };

    handleTypeFilterClick = type => {
        // this.setState({
        //     iconTypeFilter: type,
        //     icons: filterIcons(this.iconsCache[type], this.state.textFilter),
        // });
    };

    handleTextFilterChange = debounce(375, value => {
        this.setState({
            debouncedTextFilter: value,
        });
        this.updateTextFilter();
    });

    updateTextFilter = () => {
        const icons = this.iconsCache[this.state.iconTypeFilter];
        this.setState({
            icons: filterIcons(icons, this.state.debouncedTextFilter),
        });
    };

    renderIconButtonImage = iconKey => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        const fallbackIconPath = `${contextPath}/api/icons/dhis2_logo_outline/icon.svg`;
        return (
            <img
                src={`${contextPath}/api/icons/${iconKey}/icon.svg`}
                alt={altText}
                className="icon-picker__icon-button-image"
                style={{ backgroundColor: 'white', overflow: 'hidden' }}
                onError={({ target }) => {
                    target.onerror = '';
                    target.src = fallbackIconPath;
                    return true;
                }}
            />
        );
    };

    renderIconButton = () => {
        const { iconKey } = this.state;
        const buttons = [];

        buttons.push(
            <Button
                onClick={this.handleOpen}
                style={{
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative',
                    minWidth: 129,
                    height: 36,
                    lineHeight: 2.5,
                    marginTop: 10,
                    boxShadow:
                        '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                }}
            >
                {iconKey && this.renderIconButtonImage(iconKey)}

                <span style={{ padding: '0 16px' }}>
                    {iconKey
                        ? this.context.d2.i18n.getTranslation('change_icon')
                        : this.context.d2.i18n.getTranslation('add_icon')}
                </span>
            </Button>
        );

        if (iconKey) {
            buttons.push(
                <Button
                    onClick={this.handleDeselect}
                    style={{
                        backgroundColor: '#ccc',
                        color: 'black',
                        marginLeft: 20,
                        textAlign: 'center',
                        position: 'relative',
                        minWidth: 129,
                        height: 36,
                        lineHeight: 2.5,
                        marginTop: 10,
                        boxShadow:
                            '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                    }}
                >
                    {this.context.d2.i18n.getTranslation('deselect_icon')}
                </Button>
            );
        }

        return buttons;
    };

    handleDeselect = () => {
        this.setState({ iconKey: '' });
        this.props.updateStyleState({ icon: '' });
    };

    renderActions = () => [
        <RaisedButton
            label={this.context.d2.i18n.getTranslation('select')}
            primary
            onClick={this.handleConfirm}
        />,
        <FlatButton
            label={this.context.d2.i18n.getTranslation('cancel')}
            onClick={this.handleCancel}
        />,
    ];

    renderTypeFilter = () => (
        <div className="icon-picker__filter-button-wrap">
            {['all', 'positive', 'negative', 'outline', 'custom'].map(type => (
                <FlatButton
                    key={type}
                    label={this.context.d2.i18n.getTranslation(`icons_${type}`)}
                    primary={type === this.state.iconTypeFilter}
                    onClick={() =>
                        this.setState({
                            iconTypeFilter: type,
                        })
                    }
                />
            ))}
        </div>
    );

    renderTextFilter = () => (
        <TextField
            type="search"
            floatingLabelText={this.context.d2.i18n.getTranslation(
                'icon_search'
            )}
            onChange={event => this.handleTextFilterChange(event.target.value)}
        />
    );

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
                    autoScrollBodyContent
                >
                    <div className="icon-picker__filter-bar">
                        {this.renderTypeFilter()}
                        {this.renderTextFilter()}
                    </div>
                    <div className="icon-picker__scroll-box">
                        {this.state.iconTypeFilter === 'custom' ? (
                            <IconPickerCustomTab
                                onIconUpload={iconKey => {
                                    if (this.iconListRef) {
                                        this.iconListRef.fetchIconAndAddToStartOfList(
                                            iconKey
                                        );
                                    }
                                }}
                            >
                                <IconList
                                    ref={ref => (this.iconListRef = ref)}
                                    onIconSelect={this.handleIconSelect}
                                    type={'custom'}
                                    textFilter={this.state.debouncedTextFilter}
                                    selectedIconKey={this.state.selectedIconKey}
                                    prependedIcons={this.state.uploadedIcons}
                                />
                            </IconPickerCustomTab>
                        ) : (
                            <IconList
                                onIconSelect={this.handleIconSelect}
                                type={'default'}
                                textFilter={this.state.debouncedTextFilter}
                                selectedIconKey={this.state.selectedIconKey}
                            />
                        )}
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
