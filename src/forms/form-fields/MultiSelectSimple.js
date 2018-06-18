import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import ReactList from 'react-list';
import {  pullAllBy } from 'lodash/fp';
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
        overflow: 'scroll',
    },
    select: {
        width: '100%',
        height: '235px',
        border: 'none',
        fontFamily: 'Roboto',
        fontSize: 13,
        outline: 'none',
        overflow: 'unset',
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

class LazyItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { itemKey, item, handleAssign } = this.props;
        return (
            this.props.loading ? <option key={itemKey}>Loading...</option> :
                <option
                    key={itemKey}
                    value={item.value}
                    onDoubleClick={this.props.onDoubleClick}
                    style={styles.options}
                >
                {item.text}
                </option>
        );
    }
}

class SimpleMultiSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValues: [],
            indexMapToRemovedArr: [],
            availableItems: pullAllBy('value', props.selected, props.items)
        };

        this.cache = new Set();
        this.getTranslation = t => t;

    }

    componentWillReceiveProps(nextProps) {
        const props = this.props;
        if (nextProps.items !== props.items ||  nextProps.selected !== props.selected) {
            console.log("UPDATE AVAILABLE ITEMS")
            this.setState({
                availableItems: this.getAvailableItems(nextProps),
            })
        } else {
            console.log("NO SET STATE", nextProps.items.length, props.items.length )
        }

    }

    handleAssign = event => {

        this.props.onAssign(this.state.selectedValues);
    };

    handleRemove = event => {
  
        this.props.onRemove(this.state.selectedValues);
    };

    handleAssignAll = event => {
        this.props.handleAssignAll(event);
    };

    handleSelect = event => {
        const values = [...event.target.options]
            .filter(o => o.selected)
            .map(o => o.value);

        console.log(values);

        this.setState({
            selectedValues: values,
        });

        this.props.handleSelect && this.props.handleSelect(values);
    };

    getAvailableItems = (props = this.props) => {
        const selected = props.selected;
        const items = pullAllBy('value', props.selected, props.items);
        /*
               const filtered = this.props.items.filter(item => {
        
                   
                    const selectedIndex = selected.findIndex((s =>
                       s.value === item.value
                    ));
                    const isSelected = selectedIndex > -1;
                    if(isSelected) {
                        
                    }
                    return !isSelected;
                }); */

        return items;
    }

    getUnfilteredCount = () => {
        const availableLength = this.props.itemsLength
            ? this.props.itemsLength
            : this.props.items.length;

        return availableLength - this.props.selected.length;
    };

    getFilteredCount = () => {

    }

    getTotalItemsCount = () => {
        return this.props.itemsLength
            ? this.props.itemsLength
            : this.props.items.length;
    };

    getAvailableItemsCount = () => {
        return this.state.availableItems.length;
    }

    getAvailableItemsFilterCount = () => {
        return this.getTotalItemsCount() - this.props.selected.length;
    };

    getAvailableItemsUnfilteredCount() {
        return this.getAvailableItemsCount() - this.getAvailableItemsFilterCount();
    }

    getHiddenItemsLabel = itemCount => {
        return `HIDDEN by filters${itemCount}`;
        // return (this.getTotalItemsCount() > 0 && this.getFilterText().length > 0 ? `${itemCount} ${this.getTranslation('hidden_by_filters')}` : '');
    };

    getItemIsSelected(item) {
        const isSelected = this.props.selected.find(s => s.value === item.value);
        return !!isSelected;
    }

    getRenderItem = index => {
        const items = this.props.items;
        let item = items[index];
        var nextIndex = index++;
        while (item && this.getItemIsSelected(item)) {

            if (this.state.loadingCalled.has(nextIndex)) {
                //loadingCalled.set(nextIndex, true);
                nextIndex++;
            }
            item = items[nextIndex];
        }
        return { item, nextIndex };

    }

    renderLeftItem = (index, key) => {
        const item = this.state.availableItems[index];
        //   const itemsNotSelected = this.getAvailableItems();
        //  const { item, nextIndex} = this.getRenderItem(index);
        if (!item) {
            if (!this.cache.has(index)) {
                this.cache.add(index);
                this.props.onItemsEnd(index);
            }
            //return null;
            return <LazyItem item={item} index={index} key={key} loading={!item} />;
        }
        //const val = items[index].value;


        return this.props.renderItem ? (
            this.props.renderLeftItem(index, key)
        ) : (
                <option
                    key={key}
                    value={item.value}
                    onDoubleClick={this.handleAssign}
                    style={styles.options}
                >
                    {item.text}
                </option>
            );
    };

    renderRightItem = (index, key) => {
        return this.props.renderRightItem ? (
            this.props.renderRightItem(index, key)
        ) : (
                <option
                    key={key}
                    value={this.props.selected[index].value}
                    onDoubleClick={this.handleRemove}
                    style={styles.options}
                >
                    {this.props.selected[index].text}
                </option>
            );
    };
    renderMiddle = () => {
        return (
            <div style={styles.middle}>
                <div style={styles.selected}>
                    {this.props.selected.length > 0
                        ? this.props.selected.length
                        : ''}
                </div>
                <RaisedButton
                    label="&rarr;"
                    secondary
                    onClick={this.handleAssign}
                    style={styles.buttons}
                    disabled={
                        this.props.loading ||
                        this.getAvailableItemsFilterCount() === 0
                    }
                />
                <RaisedButton
                    label="&larr;"
                    secondary
                    onClick={this.onRemoveItems}
                    style={styles.buttons}
                    disabled={
                        this.props.loading || this.props.selected.length === 0
                    }
                />
                <div style={styles.status}>
                    {this.props.loading ? (
                        <CircularProgress
                            small
                            style={{ width: 60, height: 60 }}
                        />
                    ) : (
                            undefined
                        )}
                </div>
            </div>
        );
    };
    renderLeft = () => {
        const availLength = this.state.availableItems.length;
        const totalCount = this.getTotalItemsCount();
        return (
            <div style={styles.left}>
                <Paper style={styles.paper} ref={ref => (this.paperRef = ref)}>
                    <ReactList
                        type="simple"
                        itemRenderer={this.renderLeftItem}
                        itemsRenderer={this.itemsRenderer}
                        length={availLength < totalCount ? availLength + 1 : totalCount}
                        ref="left"
                        items={this.state.availableItems}
                    />
                </Paper>
                <RaisedButton
                    label={`${this.getTranslation('assign_all')} ${
                        this.getTotalItemsCount() === 0
                            ? ''
                            : this.getAvailableItemsCount()
                        } \u2192`}
                    disabled={
                        this.props.loading || this.getUnfilteredCount() === 0
                    }
                    onClick={this.handleAssignAll}
                    style={{ marginTop: '1rem' }}
                    secondary
                />
            </div>
        );
    };

    itemsRenderer = (items, ref) => (
        <select
            multiple
            style={styles.select}
            //onChange={onChangeLeft}
            ref={ref}
            onChange={this.handleSelect}
        >
            {items}
        </select>
    );

    renderRight = () => {
        const ItemsRenderer = (items, ref) => (
            <select
                multiple
                style={styles.select}
                //onChange={onChangeLeft}
                ref={ref}
            />
        );
        return (
            <div style={styles.right}>
                <Paper style={styles.paper}>
                    <div style={styles.hidden}>
                        {this.getHiddenItemsLabel(this.getTotalItemsCount())}
                    </div>
                    <ReactList
                        type="uniform"
                        itemRenderer={this.renderRightItem}
                        itemsRenderer={this.itemsRenderer}
                        length={this.props.selected.length}
                    />
                </Paper>
                <RaisedButton
                    label={`\u2190 ${this.getTranslation('remove_all')} ${
                        this.getUnfilteredCount() > 0
                            ? this.getUnfilteredCount()
                            : ''
                        }`}
                    style={{ float: 'right', marginTop: '1rem' }}
                    disabled={
                        this.props.loading || this.getUnfilteredCount() === 0
                    }
                    onClick={this.onRemoveAll}
                    secondary
                />
            </div>
        );
    };

    render() {
        return (
            <div style={styles.container}>
                {this.renderLeft()}
                {this.renderMiddle()}
                {this.renderRight()}
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

export default SimpleMultiSelect;
