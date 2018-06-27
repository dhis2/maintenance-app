import React, { Component } from 'react';
import { debounce } from 'lodash/fp';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Icon from './Icon';

export default class IconPickerDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            iconKey: props.iconKey,
            icons: null,
        };
    }

    fetchIconLibrary = () => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        // this.context.d2.Api.getApi().request('GET', `${contextPath}/api/icons`)
        //     .then((icons) => {
        //         this.setState({ icons });
        //     });
    }

    handleOpen = () => {
        this.fetchIconLibrary();
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleIconSelect = (iconKey) => {
        this.setState({ iconKey });
    };

    renderIconButtonImage = (iconKey) => {
        const contextPath = this.context.d2.system.systemInfo.contextPath;
        const altText = this.context.d2.i18n.getTranslation('current_icon');
        return (
            <img
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
            <FlatButton
                label="Cancel"
                primary
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary
                onClick={this.handleClose}
            />,
        ]
    )

    renderTypeFilter = () => (
        <div className="icon-picker__filter-button-wrap">
            <FlatButton
                label={this.context.d2.i18n.getTranslation('icons_all')}
                primary
                onClick={() => this.handleTypeFilterClick('all')}
            />
            <FlatButton
                label={this.context.d2.i18n.getTranslation('icons_positive')}
                primary
                onClick={() => this.handleTypeFilterClick('positive')}
            />
            <FlatButton
                label={this.context.d2.i18n.getTranslation('icons_negative')}
                primary
                onClick={() => this.handleTypeFilterClick('negative')}
            />
            <FlatButton
                label={this.context.d2.i18n.getTranslation('icons_outline')}
                primary
                onClick={() => this.handleTypeFilterClick('outline')}
            />
        </div>
    )

    renderTextFilter = () => (
        <TextField
            type="search"
            floatingLabelText={this.context.d2.i18n.getTranslation('icon_search')}
        />
    )

    renderIconLibrary = () => {
        const { icons, iconKey } = this.state;
        if (!icons) {
            return (
                <div className="icon-picker__icon-list--loading">
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
                    {this.renderIconLibrary()}
                </Dialog>
            </div>
        );
    }
}

IconPickerDialog.propTypes = {
    iconKey: PropTypes.string.isRequired,
    updateStyleState: PropTypes.func.isRequired,
    modelName: PropTypes.string.isRequired,
};

IconPickerDialog.contextTypes = {
    d2: PropTypes.object,
};
