import React, { Component, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { isObject } from 'lodash/fp';
import { isString } from 'lodash/fp';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import addD2Context from '../component-helpers/addD2Context';
import { findValueRenderer } from './data-value/valueRenderers';

function getD2ModelValueType(dataSource, columnName) {
    return dataSource && dataSource.modelDefinition && dataSource.modelDefinition.modelValidations && dataSource.modelDefinition.modelValidations[columnName] && dataSource.modelDefinition.modelValidations[columnName].type;
}

const DataTableRow = addD2Context(class extends Component {
    iconMenuClick = (event) => {
        this.props.itemClicked(event, this.props.dataSource);
    };

    singleActionClick = () => {
        if (this.hasSingleAction()) {
            this.singleAction().action(this.props.dataSource);
        }
    };

    handleContextClick = (event) => {
        event && event.preventDefault();
        this.props.itemClicked(event, this.props.dataSource);
    };

    handleClick = (event) => {
        this.props.primaryClick(this.props.dataSource, event);
    };

    hasContextMenu = () => {
        return Object.keys(this.props.contextMenuActions || {}).length > 1;
    };

    hasSingleAction = () => {
        return Object.keys(this.props.contextMenuActions || {}).length === 1;
    };

    singleAction = () => {
        if (this.hasSingleAction()) {
            const actionKeys = Object.keys(this.props.contextMenuActions || {});
            const label = actionKeys[0];
            const action = this.props.contextMenuActions[label];
            const icon = this.props.contextMenuIcons && this.props.contextMenuIcons[label] ? this.props.contextMenuIcons[label] : label;
            return {
                label: label,
                action: action,
                icon: icon,
            };
        }
        return null;
    };

    render() {
        const classList = classes(
            'data-table__rows__row',
            {
                'data-table__rows__row--even': !this.props.isOdd,
                'data-table__rows__row--odd': this.props.isOdd,
            });

        const columns = this.props.columns.map((columnName, index) => {
            const valueDetails = {
                valueType: getD2ModelValueType(this.props.dataSource, columnName),
                value: this.props.dataSource[columnName],
                columnName,
            };

            const Value = findValueRenderer(valueDetails);

            return (
                <div
                    key={index}
                    className={'data-table__rows__row__column'}
                    onContextMenu={this.handleContextClick}
                    onClick={this.handleClick}
                >
                    <Value {...valueDetails} />
                </div>
            );
        });

        return (
            <div className={classList}>
                {columns}
                {this.hasContextMenu() &&
                    <div className={'data-table__rows__row__column'} style={{ width: '1%' }}>
                        <IconButton tooltip={this.context.d2.i18n.getTranslation('actions')} onClick={this.iconMenuClick}>
                            <MoreVert />
                        </IconButton>
                    </div>
                }
                {this.hasSingleAction() &&
                    <div className={'data-table__rows__row__column'} style={{ width: '1%' }}>
                        <IconButton tooltip={this.context.d2.i18n.getTranslation(this.singleAction().label)} onClick={this.singleActionClick}>
                            <FontIcon className={'material-icons'}>
                                {this.singleAction().icon}
                            </FontIcon>
                        </IconButton>
                    </div>
                }
            </div>
        );
    }
});

DataTableRow.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    dataSource: PropTypes.object,
    isEven: PropTypes.bool,
    isOdd: PropTypes.bool,
    itemClicked: PropTypes.func.isRequired,
    primaryClick: PropTypes.func.isRequired,
    contextMenuActions: PropTypes.object,
    contextMenuIcons: PropTypes.object,
};

export default DataTableRow;
