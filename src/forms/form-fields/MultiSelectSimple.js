import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import ReactList from 'react-list';
const styles = {
    container: {
        display: 'flex',
        marginTop: 16,
        marginBottom: 32,
        height: `250px`,
    },
    left: {
        flex: '1 0 120px',
    },
    middle: {
        flex: '0 0 120px',
        alignSelf: 'center',
        textAlign: 'center',
    },
    right: {
        flex: '1 0 120px',
    },
    paper: {
        width: '100%',
        height: '100%',
    },
    select: {
        width: '100%',
        minHeight: '50px',
        height: `15px`,
        border: 'none',
        fontFamily: 'Roboto',
        fontSize: 13,
        outline: 'none',
    },
    options: {
        padding: '.25rem .5rem',
    },
    buttons: {
        minWidth: '100px',
        maxWidth: '100px',
        marginTop: '8px',
    },
    selected: {
        fontSize: 13,
        minHeight: '15px',
        marginTop: '45px',
        padding: '0 8px',
    },
    status: {
        marginTop: '8px',
        minHeight: '60px',
    },
    hidden: {
        fontSize: 13,
        color: '#404040',
        fontStyle: 'italic',
        textAlign: 'center',
        width: '100%',
        background: '#d0d0d0',
        maxHeight: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

class SimpleMultiSelect extends React.Componenet {
    constructor(props) {
        super(props);
    }

    handleAssign = event => {
        const values = [...event.target.options]
            .filter(o => o.selected)
            .map(o => o.value);

        this.props.onAssign(values);
    };

    handleRemove = event => {
        const values = [...event.target.options]
            .filter(o => o.selected)
            .map(o => o.value);
        this.props.onRemove(values);
    };

    handleAssignAll = event => {
        this.props.handleAssignAll(event);
    };

    getUnfilteredCount = () => {
        const availableLength = this.props.itemsLength
            ? this.props.ItemsLength
            : items.length;

        return availableLength - this.props.selected.length;
    };

    getTotalItemsCount = () => {
        return this.props.itemsLength ? this.props.ItemsLength : items.length;
    };

    getAvailableItemsFilterCount = () => {
        return this.getTotalItemsCount() - this.props.selected.length;
    };

    getHiddenItemsLabel = itemCount => {
        return `HIDDEN by filters${itemCount}`;
        // return (this.getTotalItemsCount() > 0 && this.getFilterText().length > 0 ? `${itemCount} ${this.getTranslation('hidden_by_filters')}` : '');
    };

    renderLeftItem = (index, key) => {
        return;
        this.props.renderItem ? (
            this.props.renderLeftItem(index, key)
        ) : (
            <select
                multiple
                style={styles.select}
                //onChange={onChangeLeft}
                ref={r => {
                    this.leftSelect = r;
                }}
            >
                <option
                    key={key}
                    value={this.props.items[index].value}
                    onDoubleClick={this.handleAssign}
                    style={styles.options}
                >
                    {this.props.items[index].text}
                </option>
            </select>
        );
    };

    renderRightItem = (index, key) => {
        return;
        this.props.renderItem ? (
            this.props.renderLeftItem(index, key)
        ) : (
            <select
                multiple
                style={styles.select}
               // onChange={onChangeLeft}
                ref={r => {
                    this.leftSelect = r;
                }}
            >
                <option
                    key={key}
                    value={this.props.items[index].value}
                    onDoubleClick={this.handleAssign}
                    style={styles.options}
                >
                    {this.props.items[index].text}
                </option>
            </select>
        );
    };
    renderMiddle = () => {
        <div style={styles.middle}>
            <div style={styles.selected}>
                {this.props.selected.length > 0
                    ? this.props.selected.lenght
                    : ''}
            </div>
            <RaisedButton
                label="&rarr;"
                secondary
                onClick={this.onAssignItems}
                style={styles.buttons}
                disabled={
                    this.props.loading ||
                    this.props.getAvailableItemsFilterCount() === 0
                }
            />
            <RaisedButton
                label="&larr;"
                secondary
                onClick={this.onRemoveItems}
                style={styles.buttons}
                disabled={this.state.loading || this.state.selectedRight === 0}
            />
            <div style={styles.status}>
                {this.props.loading ? (
                    <CircularProgress small style={{ width: 60, height: 60 }} />
                ) : (
                    undefined
                )}
            </div>
        </div>;
    };
    renderLeft = () => {
        <div style={styles.left}>
            <Paper style={styles.paper}>
                <div style={styles.hidden}>
                    {this.getHiddenItemsLabel(
                        this.getAvailableItemsFilterCount()
                    )}
                </div>
                <ReactList
                    type="uniform"
                    itemRenderer={this.renderLeftItem}
                    length={this.getTotalItemsCount()}
                />
            </Paper>
            <RaisedButton
                label={`${this.getTranslation('assign_all')} ${
                    this.getUnfilteredCount() === 0
                        ? ''
                        : this.getUnfilteredCount()
                } \u2192`}
                disabled={
                    this.state.loading ||
                    this.getUnfilteredCount() === 0
                }
                onClick={this.handleAssignAll}
                style={{ marginTop: '1rem' }}
                secondary
            />
        </div>;
    };

    renderRight = () => {
        <div style={styles.right}>
            <Paper style={styles.paper}>
                <div style={styles.hidden}>
                    {this.getHiddenItemsLabel(
                        this.getAssignedItemsFilterCount()
                    )}
                </div>
                <ReactList
                    type="uniform"
                    itemRenderer={this.renderRightItem}
                    length={this.getTotalItemsCount()}
                />
            </Paper>
            <RaisedButton
                label={`\u2190 ${this.getTranslation('remove_all')} ${
                    this.getAssignedItemsUnfilteredCount() > 0
                        ? this.getAssignedItemsUnfilteredCount()
                        : ''
                }`}
                style={{ float: 'right', marginTop: '1rem' }}
                disabled={
                    this.state.loading ||
                    this.getAssignedItemsUnfilteredCount() === 0
                }
                onClick={this.onRemoveAll}
                secondary
            />
        </div>;
    };

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.left}>
                    <Paper style={styles.paper}>
                        <div style={styles.hidden}>
                            {this.getHiddenItemsLabel(
                                this.getAvailableItemsFilterCount()
                            )}
                        </div>
                        <select
                            multiple
                            style={styles.select}
                            onChange={onChangeLeft}
                            ref={r => {
                                this.leftSelect = r;
                            }}
                        >
                            {this.getAvailableItemsFiltered().map(item => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    onDoubleClick={this.onAssignItems}
                                    style={styles.options}
                                >
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    </Paper>
                    <RaisedButton
                        label={`${this.getTranslation('assign_all')} ${
                            this.getAvailableItemsUnfilteredCount() === 0
                                ? ''
                                : this.getAvailableItemsUnfilteredCount()
                        } \u2192 `}
                        disabled={
                            this.state.loading ||
                            this.getAvailableItemsUnfilteredCount() === 0
                        }
                        onClick={this.onAssignAll}
                        style={{ marginTop: '1rem' }}
                        secondary
                    />
                </div>
                <div style={styles.middle}>
                    <div style={styles.selected}>{selectedLabel()}</div>
                    <RaisedButton
                        label="&rarr;"
                        secondary
                        onClick={this.onAssignItems}
                        style={styles.buttons}
                        disabled={
                            this.state.loading || this.state.selectedLeft === 0
                        }
                    />
                    <RaisedButton
                        label="&larr;"
                        secondary
                        onClick={this.onRemoveItems}
                        style={styles.buttons}
                        disabled={
                            this.state.loading || this.state.selectedRight === 0
                        }
                    />
                    <div style={styles.status}>
                        {this.state.loading ? (
                            <CircularProgress
                                small
                                style={{ width: 60, height: 60 }}
                            />
                        ) : (
                            undefined
                        )}
                    </div>
                </div>
                <div style={styles.right}>
                    <Paper style={styles.paper}>
                        <div style={styles.hidden}>
                            {this.getHiddenItemsLabel(
                                this.getAssignedItemsFilterCount()
                            )}
                        </div>
                        <select
                            multiple
                            style={styles.select}
                            onChange={onChangeRight}
                            ref={r => {
                                this.rightSelect = r;
                            }}
                        >
                            {this.getAssignedItemsFiltered()
                                .sort(this.byAssignedItemsOrder)
                                .map(item => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                        onDoubleClick={this.onRemoveItems}
                                        style={styles.options}
                                    >
                                        {item.text}
                                    </option>
                                ))}
                        </select>
                    </Paper>
                    <RaisedButton
                        label={`\u2190 ${this.getTranslation('remove_all')} ${
                            this.getAssignedItemsUnfilteredCount() > 0
                                ? this.getAssignedItemsUnfilteredCount()
                                : ''
                        }`}
                        style={{ float: 'right', marginTop: '1rem' }}
                        disabled={
                            this.state.loading ||
                            this.getAssignedItemsUnfilteredCount() === 0
                        }
                        onClick={this.onRemoveAll}
                        secondary
                    />
                </div>
            </div>
        );
    }
}

SimpleMultiSelect.PropTypes = {
    items: PropTypes.array,
    selected: PropTypes.array,
    itemsLength: PropTypes.int,
};
SimpleMultiSelect.defaultProps = {
    selectLabel: 'Selected',
};
