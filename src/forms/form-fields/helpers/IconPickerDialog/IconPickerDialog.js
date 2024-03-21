import React, { Component } from 'react';
import { debounce } from 'lodash/fp';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { IconPickerCustomTab } from './IconPickerCustomTab.js';
import { IconList } from './IconList.js';

const isSupportedApiIconType = type =>
    ['all', 'default', 'custom'].includes(type);
const isVarianceIconType = type =>
    ['positive', 'negative', 'outline'].includes(type);

export default class IconPickerDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            iconKey: props.iconKey,
            selectedIconKey: props.iconKey,
            icons: null,
            iconTypeFilter: 'all',
            textFilter: '',
            debouncedTextFilter: '',
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
        if (isVarianceIconType(type)) {
            // this is not ideal, but we're translating the filters to just
            // a prefilled search
            // we cannot combine searching for eg. "positive" and a user-defined search...
            this.handleTextFilterChange(type, true);
        }

        this.setState({
            iconTypeFilter: type,
        });

        const previousFilter = this.state.iconTypeFilter;
        // if moving from a prefilled-search, clear filter when changing tab
        if (
            isVarianceIconType(previousFilter) &&
            isSupportedApiIconType(type)
        ) {
            this.handleTextFilterChange('', true);
        }
    };

    debouncedFilterChange = debounce(375, value => {
        this.setState({
            debouncedTextFilter: value,
        });
    });

    handleTextFilterChange = (value, immediate = false) => {
        this.setState({ textFilter: value });
        this.debouncedFilterChange(value);
        if (immediate) {
            this.debouncedFilterChange.flush();
        }
    };

    renderIconButtonImage = iconKey => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        const fallbackIconPath = `${contextPath}/api/icons/dhis2_logo_outline/icon.svg`;

        // need function for this-context
        function onError({ target}) {
            // prevent infinite loop on error
            this.onerror = null;
            this.src = fallbackIconPath;
        }
        return (
            <img
                src={`${contextPath}/api/icons/${iconKey}/icon.svg`}
                alt={altText}
                className="icon-picker__icon-button-image"
                style={{ backgroundColor: 'white', overflow: 'hidden' }}
                onError={onError}
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
                    onClick={() => this.handleTypeFilterClick(type)}
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
            value={this.state.textFilter}
            onChange={event => {
                const value = event.target.value;
                this.setState({ textFilter: value });
                this.handleTextFilterChange(value);
            }}
        />
    );

    render() {
        // iconTypeFilter is used to control the tabs
        // however, the API does not have a concept of "positive" and "negative", so we just do a search instead
        const iconApiType = isSupportedApiIconType(this.state.iconTypeFilter)
            ? this.state.iconTypeFilter
            : 'all';
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
                                />
                            </IconPickerCustomTab>
                        ) : (
                            <IconList
                                // reset when
                                key={this.state.iconTypeFilter}
                                onIconSelect={this.handleIconSelect}
                                type={iconApiType}
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
